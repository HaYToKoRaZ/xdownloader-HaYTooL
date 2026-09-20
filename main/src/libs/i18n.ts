/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { i18n } from 'webextension-polyfill'

export const i18nLocalize = (kw: string, substitutions?: string | string[]) => {
  if (customDictionary && customDictionary[kw]) {
    return customDictionary[kw].message
  }
  return i18n.getMessage(kw, substitutions)
}

let customDictionary: Record<string, { message: string }> | null = null
let currentLocale: string =
  (typeof window !== 'undefined' && localStorage.getItem('haytool_locale')) ||
  i18n.getUILanguage() ||
  'en'

export const getActiveLocale = () => currentLocale

export const setLocale = async (lang: string) => {
  try {
    const url = typeof chrome !== 'undefined' && chrome.runtime?.getURL
      ? chrome.runtime.getURL(`_locales/${lang}/messages.json`)
      : `_locales/${lang}/messages.json`
    const res = await fetch(url)
    if (res.ok) {
      customDictionary = await res.json()
      currentLocale = lang
      if (typeof window !== 'undefined') {
        localStorage.setItem('haytool_locale', lang)
        document.documentElement.setAttribute('lang', lang)
      }
      return true
    }
  } catch (err) {
    console.error('Failed to load locale dictionary:', lang, err)
  }
  return false
}

// Auto-initialize if saved in localStorage
if (typeof window !== 'undefined') {
  const savedLocale = localStorage.getItem('haytool_locale')
  if (savedLocale) {
    setLocale(savedLocale)
  }
}

/**
 * Web extension translation only allows `[A-Z][a-z][0-9]` and `_` as key.
 */
const makeMsgId = (text: string) => (context?: string) =>
  context ? `${context}_${text}` : text

const replaceMessagePlaceholders =
  (placeholders: Record<string, string>) => (message: string) =>
    Object.entries(placeholders).reduce(
      (msg, [key, value]) => msg.replaceAll(`{{${key.toLowerCase()}}}`, value),
      message
    )

export const getText = (
  text: string,
  context?: string,
  placeholders?: Record<string, string>
) => {
  const msgKey = makeMsgId(text)(context)
  const message =
    customDictionary?.[msgKey]?.message || i18n.getMessage(msgKey) || text
  return placeholders
    ? replaceMessagePlaceholders(placeholders)(message)
    : message
}

export const getTextPlural = (
  count: number,
  text: string,
  pluralText: string,
  context?: string,
  placeholders?: Record<string, string>
) => {
  const targetText = count > 1 ? pluralText : text

  const message =
    i18n
      .getMessage(makeMsgId(targetText)(context))
      ?.replace(/\{\{[n|N]\}\}/, count.toString()) || targetText

  return placeholders
    ? replaceMessagePlaceholders(placeholders)(message)
    : message
}
