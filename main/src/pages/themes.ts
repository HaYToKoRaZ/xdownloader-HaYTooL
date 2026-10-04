/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { type ThemeConfig, extendTheme } from '@chakra-ui/react'
import type { StyleFunctionProps } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  fonts: {
    heading:
      '"Inter", "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", Roboto, sans-serif',
    body: '"Inter", "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", Roboto, sans-serif',
  },
  colors: {
    brand: {
      green: 'rgb(0, 186, 124)',
      red: '#DD277E',
      blue: '#414CE0',
      // yellow: '#F1BA1D',
      yellow: {
        50: '#F1BA1D',
        100: '#F1BA1D',
        200: '#F1BA1D',
        300: '#d8a40d',
        400: '#d8a40d',
        500: '#d8a40d',
        600: '#d8a40d',
        700: '#d8a40d',
        800: '#d8a40d',
        900: '#d8a40d',
      },
      pink: {
        50: '#d6438e',
        100: '#d6438e',
        200: '#d6438e',
        300: '#bc2975',
        400: '#bc2975',
        500: '#bc2975',
        600: '#bc2975',
        700: '#bc2975',
        800: '#bc2975',
        900: '#bc2975',
      },
      bg: '#0F172A',
      card: '#1E293B',
      primary: '#2563EB',
      accent: '#10B981',
    },
    token: {
      default: 'white',
      active: '#38BDF8',
    },
  },
  shadows: {
    outline: '0 0 0 3px rgba(37, 99, 235, 0.5)',
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'lg',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        _focusVisible: { boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.5)' },
        _active: { transform: 'scale(0.97)' },
      },
    },
    IconButton: {
      baseStyle: {
        borderRadius: 'lg',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        _focusVisible: { boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.5)' },
        _active: { transform: 'scale(0.92)' },
      },
    },
    Switch: {
      baseStyle: {
        track: {
          transition: 'all 200ms ease',
          _checked: { bg: '#2563EB' },
          _focusVisible: { boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.5)' },
        },
      },
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      html: {
        height: '100%',
      },
      body: {
        bg: props.colorMode === 'dark' ? '#0F172A' : '#F8FAFC',
        color: props.colorMode === 'dark' ? '#F8FAFC' : '#0F172A',
        height: '100%',
        overflowY: 'auto',
        lineHeight: 1.5,
      },
      '#root': {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      },
      'button, [role="button"], a, label': {
        cursor: 'pointer',
      },
      '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': {
          animationDuration: '0.01ms !important',
          transitionDuration: '0.01ms !important',
        },
      },
    }),
  },
})

export default theme
