/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { IUsageStatisticsRepository } from '#domain/repositories/usageStatistics'
import { getText as i18n } from '#libs/i18n'
import PopupFeatureBlock, {
  type PopupFeatureBlockProps,
} from '#pages/components/PopupFeatureBlock'
import useStatsStore from '#pages/hooks/useStatsStore'
import Links from '#pages/links'
import { createStatsStore } from '#pages/stores/StatsStore'
import type { TestableComponent } from '#pages/types/props'
import { V4Statistics } from '#schema'
import { getFullVersion } from '#utils/runtime'
import {
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { BiHistory, BiWorld } from 'react-icons/bi'
import { FaGithub } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import type { IconType } from 'react-icons/lib'
import { type Storage, runtime, storage, tabs } from 'webextension-polyfill'

const NavBar = () => {
  return (
    <Flex w="100%" h="48px" px={4} align="center">
      <HStack spacing={2} align="center">
        <Box
          as="img"
          src="assets/icons/icon@32.png"
          w="22px"
          h="22px"
          alt="XDownloader"
          borderRadius="4px"
        />
        <Text fontSize="0.95rem" fontWeight="bold" color="cyan.400" letterSpacing="wide">
          XDownloader
        </Text>
      </HStack>
      <Spacer />
      <HStack spacing={1}>
        <IconButton
          aria-label="history"
          variant="ghost"
          size="sm"
          bg="transparent"
          color="white"
          _hover={{ bg: 'rgba(255, 255, 255, 0.15)' }}
          _active={{ bg: 'rgba(255, 255, 255, 0.3)' }}
          icon={<Icon boxSize={5} as={BiHistory} />}
          onClick={() => {
            tabs.create({ active: true, url: runtime.getURL('index.html?section=history#history') })
          }}
          data-testid="navbar-history"
          title={i18n('History', 'options:sideMenu')}
        />
        <IconButton
          aria-label="settings"
          variant="ghost"
          size="sm"
          bg="transparent"
          color="white"
          _hover={{ bg: 'rgba(255, 255, 255, 0.15)' }}
          _active={{ bg: 'rgba(255, 255, 255, 0.3)' }}
          icon={<Icon boxSize={5} as={IoMdSettings} />}
          onClick={() => runtime.openOptionsPage()}
          data-testid="navbar-options"
          title={i18n('General', 'options:sideMenu')}
        />
      </HStack>
    </Flex>
  )
}

export type StatsProps = {
  usageStatisticsRepo: IUsageStatisticsRepository
}

const isStatisticsKey = (key: string): key is keyof V4Statistics => true

const Stats = (props: StatsProps) => {
  const [stats, { criterias, triggerChange }] = useStatsStore(
    createStatsStore({ getStats: async () => props.usageStatisticsRepo.get() })
  )

  useEffect(() => {
    const statsListener: ListenerOf<Storage.Static['onChanged']> = (
      changes,
      _areaName
    ) => {
      if (
        Object.keys(changes).some(
          storageKey => isStatisticsKey(storageKey) && criterias.has(storageKey)
        )
      )
        triggerChange()
    }

    storage.onChanged.addListener(statsListener)
    return () => storage.onChanged.removeListener(statsListener)
  }, [criterias, triggerChange])

  return (
    <Box py={1}>
      <Center>
        <Text as="span" fontSize={'2.75rem'} fontWeight={700} lineHeight="none" color="cyan.400">
          {stats.mapBy(props => props.downloadCount)}
        </Text>
      </Center>
      <Center mt={1}>
        <Text
          as="span"
          fontSize={'0.8rem'}
          textTransform="uppercase"
          letterSpacing="wider"
          color="gray.400"
          fontWeight={600}
        >
          Downloads
        </Text>
      </Center>
    </Box>
  )
}

type FooterActionButtonProps = {
  icon: IconType
  label: string
  info: string
  link: string
  setInfo: (info: string) => void
  infoReseter: () => void
} & TestableComponent

const FooterActionButton = memo((props: FooterActionButtonProps) => {
  return (
    <IconButton
      aria-label={props.label}
      variant="ghost"
      bg="transparent"
      borderRadius="md"
      _hover={{ bg: 'rgba(255, 255, 255, 0.12)' }}
      _active={{ bg: 'rgba(255, 255, 255, 0.25)' }}
      size="xs"
      color="gray.300"
      icon={<Icon boxSize={4} as={props.icon} />}
      onMouseEnter={() => props.setInfo(props.info)}
      onMouseLeave={props.infoReseter}
      onClick={() => tabs.create({ active: true, url: props.link })}
      data-testid={props.testId}
    />
  )
})

const versionName = 'v' + getFullVersion()

const Footer = () => {
  const [info, setInfo] = useState(versionName)
  const resetInfo = useCallback(() => setInfo(versionName), [])

  return (
    <Flex
      bg="#252525"
      borderTop="1px solid rgba(255, 255, 255, 0.08)"
      bottom="0"
      w="100%"
      h="38px"
      px={3}
      justify="space-between"
      align="center"
    >
      <Box
        as="button"
        fontSize={'xs'}
        color="gray.400"
        fontWeight="medium"
        cursor="pointer"
        _hover={{ color: 'cyan.300', textDecoration: 'underline' }}
        onClick={() => tabs.create({ active: true, url: Links.website })}
        title={Links.website}
      >
        <span data-testid="footer-info">{info}</span>
      </Box>
      <HStack spacing={1}>
        <FooterActionButton
          icon={FaGithub}
          label="Github"
          info="Github"
          link={Links.github}
          setInfo={setInfo}
          infoReseter={resetInfo}
          testId="footer-action-github"
        />
        <FooterActionButton
          icon={BiWorld}
          label="Portal"
          info="HaYTooL Portal"
          link={Links.portal}
          setInfo={setInfo}
          infoReseter={resetInfo}
          testId="footer-action-portal"
        />
      </HStack>
    </Flex>
  )
}

export type PopupProps = PopupFeatureBlockProps & StatsProps

const Popup = (props: PopupProps) => {
  return (
    <Flex direction="column" h="100%" justify="space-between">
      <NavBar />
      <VStack spacing={4} px={4} py={2} flex={1} justify="center">
        <Stats usageStatisticsRepo={props.usageStatisticsRepo} />
        <Box w="100%" px={2}>
          <PopupFeatureBlock featureSettingsRepo={props.featureSettingsRepo} />
        </Box>
      </VStack>
      <Footer />
    </Flex>
  )
}

export default Popup
