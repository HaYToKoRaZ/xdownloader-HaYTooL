/*
 * HaYTooL Pulse Telemetry Integration
 * Endpoint: POST https://hayto-telemetry.korazhayto.workers.dev/api/ping
 */
import AlarmName from '#enums/AlarmName'
import { alarms } from 'webextension-polyfill'

const TELEMETRY_URL = 'https://hayto-telemetry.korazhayto.workers.dev/api/ping'
const APP_ID = 'XDownloader'
const sessionId = 'ext_' + Math.random().toString(36).substring(2, 15)
let isFirst = true

async function sendPulse(): Promise<void> {
  try {
    await fetch(TELEMETRY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app: APP_ID,
        session_id: sessionId,
        is_new_session: isFirst,
      }),
    })
    isFirst = false
  } catch {
    // Fail silently on network errors
  }
}

export function initTelemetry(): void {
  // Fire pulse immediately on activation
  sendPulse()

  // Schedule alarm for every 2 minutes
  alarms.create(AlarmName.PulseTelemetry, {
    periodInMinutes: 2,
  })

  alarms.onAlarm.addListener(alarm => {
    if (alarm.name === AlarmName.PulseTelemetry) {
      sendPulse()
    }
  })
}
