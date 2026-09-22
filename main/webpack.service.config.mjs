import PACKAGE from './package.json' with { type: 'json' }
import PublicKey from './public_key.json' with { type: 'json' }
import baseConfig from './webpack.common.config.mjs'
import {
  getTarget,
  isProduction as isProductionMode,
} from './webpack/utils.mjs'
import { WebextI18nPlugin } from '@media-harvest/webext-i18n-loader'
import browserslist from 'browserslist'
import CopyPlugin from 'copy-webpack-plugin'
import { resolve } from 'path'
import semver from 'semver'
import { merge } from 'webpack-merge'

const { version } = PACKAGE

/**
 * @template T {Record<string, unknown>}
 * @param {T} manifest
 * @param {boolean} isLegacy
 * @returns T
 */
const appendDevelopmentManifestAttributes = (manifest, isLegacy) => {
  return {
    ...manifest,
    ...{
      web_accessible_resources: isLegacy
        ? ['*.map']
        : [
            {
              resources: ['*.map'],
              matches: ['<all_urls>'],
            },
          ],
    },
  }
}

/**
 * @param {unknown} manifest
 * @param {string} addOnId
 * @param {string} updateUrl
 * @returns
 */
const appendFirefoxSpecificManifestAttributes = (
  manifest,
  addOnId,
  updateUrl
) => {
  const browsers = browserslist()
  const firefoxVersions = browsers
    .filter(browser => browser.startsWith('firefox'))
    .map(browser => browser.replace('firefox ', ''))
    .map(browser => parseInt(browser, 10))

  const minFirefoxVersion = semver.minVersion(
    JSON.stringify(Math.min(...firefoxVersions)),
    {
      loose: true,
    }
  )

  return {
    ...manifest,
    ...{
      browser_specific_settings: {
        gecko: {
          id: addOnId,
          strict_min_version: `${minFirefoxVersion.major}.${minFirefoxVersion.minor}`,
          data_collection_permissions: {
            required: ['none'],
          },
          ...(updateUrl ? { update_url: updateUrl } : {}),
        },
      },
    },
  }
}

/**
 * @param {unknown} manifest
 * @param {string} addOnId
 * @param {string} updateUrl
 * @returns
 */
const appendChromiumMinimumVersion = manifest => {
  const browsers = browserslist()
  const chromeVersions = browsers
    .filter(browser => browser.startsWith('chrome'))
    .map(browser => browser.replace('chrome ', ''))
    .map(browser => parseInt(browser, 10))

  const minChromeVersion = semver.minVersion(
    JSON.stringify(Math.min(...chromeVersions)),
    {
      loose: true,
    }
  )

  return {
    ...manifest,
    minimum_chrome_version: minChromeVersion.major.toString(),
  }
}

/**
 * Webpack configuration function
 * @param {Record<string, boolean | string>} env - Environment variables passed to webpack
 * @param {import('webpack').WebpackOptionsNormalized} argv - Webpack CLI arguments
 * @returns {import('webpack').Configuration} Webpack configuration object
 */
export default (env, argv) => {
  const isProduction = isProductionMode(argv)
  const VERSION = version
  const BROWSER = getTarget(env)
  const VERSION_NAME = VERSION
  const isSelfSign = 'self-sign' in env
  const isFirefox = BROWSER === 'firefox'
  const isChrome = BROWSER === 'chrome'
  const isEdge = BROWSER === 'edge'
  const isChromium = isChrome || isEdge

  return merge(baseConfig(env, argv), {
    name: 'service',
    output: {
      chunkFormat: false,
    },
    entry: {
      sw: resolve('./src/serviceWorker/sw.ts'),
      pages: resolve('./src/pages/index.tsx'),
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new WebextI18nPlugin({
        poDir: resolve(process.cwd(), 'locales'),
      }),
      new CopyPlugin({
        patterns: [
          {
            from: isChromium ? 'manifest.json' : 'manifest_firefox_v3.json',
            context: 'src',
            to: 'manifest.json',
            transform: content => {
              let manifest = JSON.parse(content.toString())

              manifest['version'] = VERSION
              manifest['version_name'] = VERSION_NAME

              if (!isProduction) {
                manifest = appendDevelopmentManifestAttributes(manifest)
              }

              // Chrome Web Store ve Edge Partner Center, ZIP içindeki manifestte 'key' alanını reddeder.
              // Sadece geliştirme modunda ihtiyaç varsa eklenir.
              if (isEdge && !isProduction) {
                manifest['key'] = PublicKey.edge
              }

              if (isChromium) {
                manifest = appendChromiumMinimumVersion(manifest)
              }

              if (isFirefox) {
                if (isProduction) {
                  if (isSelfSign) {
                    manifest = appendFirefoxSpecificManifestAttributes(
                      manifest,
                      'xdownloader@haytool.app',
                      'https://release.mediaharvest.app/gecko/update.json'
                    )
                  } else {
                    manifest = appendFirefoxSpecificManifestAttributes(
                      manifest,
                      'xdownloader@haytool.app'
                    )
                  }
                } else {
                  manifest = appendFirefoxSpecificManifestAttributes(
                    manifest,
                    'xdownloader-dev@haytool.app'
                  )
                }
              }

              return Buffer.from(JSON.stringify(manifest))
            },
          },
          {
            from: 'assets/icons/*.png',
            context: 'src',
            to: 'assets/icons/[name][ext]',
          },
          {
            from: 'assets/flags/*.svg',
            context: 'src',
            to: 'assets/flags/[name][ext]',
          },
          {
            from: 'pages/*.html',
            context: 'src',
            to: '[name][ext]',
          },
          {
            from: 'static/**/*',
            context: 'src',
            to: 'static/[name][ext]',
          },
        ],
      }),
    ],
  })
}
