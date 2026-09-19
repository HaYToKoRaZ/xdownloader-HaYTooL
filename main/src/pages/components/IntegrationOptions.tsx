/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { ISettingsRepository } from '#domain/repositories/settings'
import type { IWarningSettingsRepo } from '#domain/repositories/warningSettings'
import { getText as i18n } from '#libs/i18n'
import useWarningSettings from '#pages/hooks/useWarningSettings'
import type { DownloadSettings } from '#schema'
import type { HelperMessage } from './controls/featureControls'
import { RichFeatureSwitch } from './controls/featureControls'
import { VStack } from '@chakra-ui/react'
import React from 'react'

type IntegrationOptionsProps = {
  downloadSettingsRepo: ISettingsRepository<DownloadSettings>
  warningSettingsRepo: IWarningSettingsRepo
}

/**
 * Some switches is disabled when `__BROWSER__` is `firefox`.
 */
const IntegrationOptions = (props: IntegrationOptionsProps) => {
  const { settings: warningSettings, toggler: warningSettingsToggler } =
    useWarningSettings(props.warningSettingsRepo)
  const isInFireFox = __BROWSER__ === 'firefox'

  const message: HelperMessage | undefined =
    __BROWSER__ === 'firefox'
      ? {
          type: 'info',
          content: i18n(
            'This integration is not compatible with {{platform}}',
            'options:integrations',
            { platform: 'Firefox' }
          ),
        }
      : undefined

  return (
    <VStack>
      <RichFeatureSwitch
        name={i18n('Filename Detector', 'options:integrations')}
        desc={i18n(
          'The detector can notify user when the filename is modified by other extensions.',
          'options:integrations'
        )}
        isOn={!warningSettings.ignoreFilenameOverwritten}
        handleClick={warningSettingsToggler.ignoreFilenameOverwritten}
        isDisable={isInFireFox}
        message={message}
        testId="filenameDetector-integration-switch"
      />
    </VStack>
  )
}

export default IntegrationOptions
