/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { DomainEventPublisher } from '#domain/eventPublisher'
import RuntimeInstalled from '#domain/events/RuntimeInstalled'
import RuntimeUpdated from '#domain/events/RuntimeUpdated'
import { getVersion } from '#utils/runtime'
import Browser, { type Runtime } from 'webextension-polyfill'

const handleRuntimeInstalled =
  (
    publisher: DomainEventPublisher
  ): ListenerOf<Runtime.Static['onInstalled']> =>
  async details => {
    if (details.reason === 'browser_update') return

    const currentVersion = getVersion()

    if (details.reason === 'install') {
      await publisher.publish(new RuntimeInstalled(currentVersion))
    }

    if (details.reason === 'update') {
      await publisher.publish(
        new RuntimeUpdated({
          current: currentVersion,
          previous: details?.previousVersion ?? currentVersion,
        })
      )
    }

    try {
      await Browser.contextMenus.removeAll()

      // 1. Tarayıcı araç çubuğundaki eklenti simgesine sağ tıklandığında (action):
      Browser.contextMenus.create({
        id: 'open-official-website',
        title: Browser.i18n.getMessage('app_contextMenu_openWebsite') || 'Resmi Web Sitesi',
        contexts: ['action'],
      })

      Browser.contextMenus.create({
        id: 'open-author-x',
        title: Browser.i18n.getMessage('app_contextMenu_openAuthorX') || 'Geliştirici X Profili (@HaYTo)',
        contexts: ['action'],
      })

      // 2. Geçmiş sekmesi (Hem eklenti simgesi sağ tıkında hem de x.com / twitter.com sayfalarında):
      Browser.contextMenus.create({
        id: 'open-history-tab',
        title: Browser.i18n.getMessage('app_contextMenu_openHistory') || 'İndirme Geçmişi',
        contexts: ['action', 'page'],
        documentUrlPatterns: [
          '*://twitter.com/*',
          '*://mobile.twitter.com/*',
          '*://tweetdeck.twitter.com/*',
          '*://x.com/*',
          '*://*.x.com/*',
        ],
      })
    } catch {
      // Menu items already registered or contextMenus API not ready
    }
  }

export default handleRuntimeInstalled
