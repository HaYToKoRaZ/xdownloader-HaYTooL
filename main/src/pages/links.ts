/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Browser from 'webextension-polyfill'

const Links = {
  github: 'https://github.com/HaYToKoRaZ/xdownloader-HaYTooL',
  portal: 'https://haytokoraz.github.io/',
  issues: 'https://github.com/HaYToKoRaZ/xdownloader-HaYTooL/issues',
  changelog:
    'https://github.com/HaYToKoRaZ/xdownloader-HaYTooL/blob/main/CHANGELOG.md#' +
    Browser.runtime.getManifest().version,
  privacy:
    'https://haytokoraz.github.io/xdownloader-HaYTooL/privacy.html',
  website: 'https://haytokoraz.github.io/xdownloader-HaYTooL/',
  xProfile: 'https://x.com/HaYTo',
}

export default Links
