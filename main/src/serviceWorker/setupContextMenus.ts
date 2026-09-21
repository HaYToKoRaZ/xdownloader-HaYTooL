/*
 * Context Menus Manager
 * Handles multi-language context menus seamlessly using local storage
 */
import Browser from 'webextension-polyfill'

const MENU_LABELS: Record<string, { portal: string; website: string; authorX: string; history: string }> = {
  tr: {
    portal: '🌐 HaYTooL Portal',
    website: '🚀 Resmi Web Sitesi',
    authorX: '👤 Geliştirici X Profili (@HaYTo)',
    history: '📜 İndirme Geçmişi',
  },
  en: {
    portal: '🌐 HaYTooL Portal',
    website: '🚀 Official Website',
    authorX: '👤 Developer X Profile (@HaYTo)',
    history: '📜 Download History',
  },
}

export async function updateContextMenus(lang?: string): Promise<void> {
  try {
    let targetLang: string = lang || ''
    if (!targetLang) {
      const stored = (await Browser.storage.local.get('haytool_locale')) as Record<string, unknown>
      targetLang = typeof stored?.haytool_locale === 'string' ? stored.haytool_locale : 'en'
    }

    const labels = (targetLang in MENU_LABELS) ? MENU_LABELS[targetLang] : MENU_LABELS.en

    await Browser.contextMenus.removeAll()

    // 1. HaYTooL Portal
    Browser.contextMenus.create({
      id: 'open-portal',
      title: labels.portal,
      contexts: ['action'],
    })

    // 2. Resmi Web Sitesi
    Browser.contextMenus.create({
      id: 'open-official-website',
      title: labels.website,
      contexts: ['action'],
    })

    // 3. Geliştirici X Profili
    Browser.contextMenus.create({
      id: 'open-author-x',
      title: labels.authorX,
      contexts: ['action'],
    })

    // 4. İndirme Geçmişi (action + sayfa sağ tık)
    Browser.contextMenus.create({
      id: 'open-history-tab',
      title: labels.history,
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
    // Fail silently if contextMenus API is temporarily busy
  }
}
