import type { IClientRepository } from '#domain/repositories/client'
import type { IDownloadRepository } from '#domain/repositories/download'
import type { IDownloadHistoryRepository } from '#domain/repositories/downloadHistory'
import type { IPortableDownloadHistoryRepository } from '#domain/repositories/portableDownloadHistory'
import type { ISettingsRepository } from '#domain/repositories/settings'
import type { ITweetCache } from '#domain/repositories/tweet'
import type { IWarningSettingsRepo } from '#domain/repositories/warningSettings'
import type { CheckDownloadWasTriggeredBySelf } from '#domain/useCases/checkDownloadWasTriggeredBySelf'
import type { DownloadFileUseCase } from '#domain/useCases/downloadFile'
import type { SearchDownloadHistory } from '#domain/useCases/searchDownloadHistory'
import type { SearchTweetIdsByHashTags } from '#domain/useCases/searchTweetIdsByHashtags'
import type { FilenameSetting } from '#domain/valueObjects/filenameSetting'
import { getText as i18n } from '#libs/i18n'
import About from '#pages/components/About'
import FeatureOptions from '#pages/components/FeatureOptions'
import GeneralOptions from '#pages/components/GeneralOptions'
import HistoryTable from '#pages/components/History'
import IntegrationOptions from '#pages/components/IntegrationOptions'
import { DownloadSettings, FeatureSettings } from '#schema'
import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  HStack,
  Heading,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import type { JSX } from 'react'
import React, { useState } from 'react'
import Links from '#pages/links'
import { getActiveLocale, setLocale } from '#libs/i18n'

const SUPPORTED_LANGUAGES = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

type SectionCardProps = {
  title: string
  children?: JSX.Element | React.ReactNode
}

const SectionCard = ({ title, children }: SectionCardProps) => {
  return (
    <Card
      variant="outline"
      borderRadius="xl"
      shadow="sm"
      borderWidth="1px"
      overflow="hidden"
      mb={6}
    >
      <CardHeader pb={2}>
        <Heading size="md" fontWeight="600">
          {title}
        </Heading>
      </CardHeader>
      <CardBody pt={2}>{children}</CardBody>
    </Card>
  )
}

type RepoProvider = {
  clientRepo: IClientRepository
  downloadSettingsRepo: ISettingsRepository<DownloadSettings>
  filenameSettingsRepo: ISettingsRepository<FilenameSetting>
  featureSettingsRepo: ISettingsRepository<FeatureSettings>
  warningSettingsRepo: IWarningSettingsRepo
  portableDownloadHistoryRepo: IPortableDownloadHistoryRepository
  downloadHistoryRepo: IDownloadHistoryRepository
  downloadRepo: IDownloadRepository
  checkDownloadIsOwnBySelf: CheckDownloadWasTriggeredBySelf
  tweetResponseCache: ITweetCache
}

type UseCaseProvider = {
  searchDownloadHistory: SearchDownloadHistory
  searchTweetIdsByHashtags: SearchTweetIdsByHashTags
  browserDownload: DownloadFileUseCase
}

type InfraProvider = RepoProvider & UseCaseProvider

const App = ({
  clientRepo,
  downloadSettingsRepo,
  filenameSettingsRepo,
  featureSettingsRepo,
  searchDownloadHistory,
  searchTweetIdsByHashtags,
  warningSettingsRepo,
  portableDownloadHistoryRepo,
  downloadHistoryRepo,
  browserDownload,
  downloadRepo,
  checkDownloadIsOwnBySelf,
  tweetResponseCache,
}: InfraProvider) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const [currentLang, setCurrentLang] = useState<string>(getActiveLocale())

  const handleLanguageChange = async (langCode: string) => {
    setCurrentLang(langCode)
    await setLocale(langCode)
    // Reload to apply dictionary across all components seamlessly
    window.location.reload()
  }

  const initialTabIndex =
    window.location.hash === '#history' ||
    new URLSearchParams(window.location.search).get('section') === 'history'
      ? 1
      : 0

  return (
    <Stack flex={1} height={'100vh'} spacing={0} overflow={'hidden'}>
      {/* Top Header */}
      <Box
        px={8}
        py={3}
        borderBottomWidth="1px"
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <HStack justify="space-between" maxW="1100px" mx="auto">
          <HStack spacing={3}>
            <Image src="assets/icons/icon@32.png" boxSize="28px" alt="XDownloader Logo" />
            <Link
              href={Links.website}
              isExternal
              _hover={{ textDecoration: 'none', color: 'cyan.500' }}
              cursor="pointer"
            >
              <Heading size="md" letterSpacing="wide">
                XDownloader HaYTooL
              </Heading>
            </Link>
          </HStack>
          <HStack spacing={3}>
            {/* Language Selector with Flags */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                size="sm"
                variant="outline"
                borderRadius="md"
                px={3}
                fontFamily="inherit"
              >
                <Text as="span" fontSize="1.15em" fontFamily="'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif" verticalAlign="middle" mr={1}>
                  {SUPPORTED_LANGUAGES.find((l) => l.code === currentLang)?.flag || '🌐'}
                </Text>
                {SUPPORTED_LANGUAGES.find((l) => l.code === currentLang)?.name || 'Language'}
              </MenuButton>
              <MenuList minW="160px" zIndex={20}>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <MenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    fontWeight={currentLang === lang.code ? 'bold' : 'normal'}
                    bg={currentLang === lang.code ? (colorMode === 'light' ? 'gray.100' : 'gray.700') : undefined}
                  >
                    <Text as="span" fontSize="1.1em" fontFamily="'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif" mr={2}>{lang.flag}</Text>
                    {lang.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <IconButton
              aria-label="Toggle Color Mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
            />
          </HStack>
        </HStack>
      </Box>

      {/* Main Content Area */}
      <Box flex={1} overflowY="auto">
        <Container maxW="1100px" py={8} px={6}>
          <Tabs variant="enclosed" colorScheme="cyan" isLazy defaultIndex={initialTabIndex}>
            <TabList mb={6} borderBottomWidth="2px">
              <Tab fontWeight="600">{i18n('General', 'options:sideMenu')}</Tab>
              <Tab fontWeight="600">{i18n('History', 'options:sideMenu')}</Tab>
            </TabList>

            <TabPanels>
              {/* Settings Main Tab (All core settings unified in one page) */}
              <TabPanel p={0}>
                <SectionCard title={i18n('General', 'options:sideMenu')}>
                  <GeneralOptions
                    downloadSettingsRepo={downloadSettingsRepo}
                    filenameSettingsRepo={filenameSettingsRepo}
                  />
                </SectionCard>

                <SectionCard title={i18n('Features', 'options:sideMenu')}>
                  <FeatureOptions featureSettingsRepo={featureSettingsRepo} />
                </SectionCard>

                <SectionCard title={i18n('Integrations', 'options:sideMenu')}>
                  <IntegrationOptions
                    downloadSettingsRepo={downloadSettingsRepo}
                    warningSettingsRepo={warningSettingsRepo}
                  />
                </SectionCard>

                <SectionCard title={i18n('About', 'options:sideMenu')}>
                  <About
                    clientRepo={clientRepo}
                    cleanCache={() => tweetResponseCache.clean()}
                  />
                </SectionCard>
              </TabPanel>

              {/* History Tab */}
              <TabPanel p={0}>
                <SectionCard title={i18n('History', 'options:sideMenu')}>
                  <HistoryTable
                    searchDownloadHistory={searchDownloadHistory}
                    searchTweetIdsByHashtags={searchTweetIdsByHashtags}
                    portableDownloadHistoryRepo={portableDownloadHistoryRepo}
                    downloadHistoryRepo={downloadHistoryRepo}
                    browserDownload={browserDownload}
                    downloadRepo={downloadRepo}
                    checkDownloadIsOwnBySelf={checkDownloadIsOwnBySelf}
                  />
                </SectionCard>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </Stack>
  )
}

export default App
