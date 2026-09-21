/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Links from '#pages/links'
import { getText as i18n } from '#libs/i18n'
import { getFullVersion } from '#utils/runtime'
import {
  Box,
  Container,
  HStack,
  Icon,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import React, { useEffect, useState } from 'react'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import { BiGlobe, BiShieldQuarter } from 'react-icons/bi'
import Browser from 'webextension-polyfill'

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 5px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
`

const FootBar = () => {
  const bg = useColorModeValue('whiteAlpha.800', 'blackAlpha.400')
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const textColor = useColorModeValue('gray.500', 'gray.400')
  const hoverColor = useColorModeValue('brand.blue', 'twitter.300')

  const badgeBg = useColorModeValue('green.50', 'rgba(16, 185, 129, 0.1)')
  const badgeBorder = useColorModeValue('green.200', 'rgba(16, 185, 129, 0.25)')
  const countColor = useColorModeValue('twitter.600', 'twitter.300')

  const [activeUsers, setActiveUsers] = useState<number>(1)

  useEffect(() => {
    try {
      if (typeof Browser !== 'undefined' && Browser.storage && Browser.storage.local) {
        Browser.storage.local.get('activeUserCount').then(res => {
          if (res && typeof res.activeUserCount === 'number') {
            setActiveUsers(Math.max(1, res.activeUserCount))
          }
        }).catch(() => {})
      }
    } catch {
      setActiveUsers(1)
    }
  }, [])

  return (
    <Box
      as="footer"
      width={'full'}
      py={4}
      mt={8}
      borderTop={'1px solid'}
      borderColor={borderColor}
      bg={bg}
    >
      <Container maxW={'container.lg'}>
        <HStack
          justify={'space-between'}
          flexWrap={'wrap'}
          spacing={4}
          fontSize={'xs'}
          color={textColor}
        >
          <HStack spacing={3} flexWrap={'wrap'}>
            <HStack spacing={2}>
              <Text fontWeight={'semibold'} color={textColor}>
                XDownloader HaYTooL
              </Text>
              <Text>v{getFullVersion()}</Text>
            </HStack>

            {/* Anlık Aktif Kullanıcı Göstergesi (WebTranslate mimarisi) */}
            <HStack
              bg={badgeBg}
              border={'1px solid'}
              borderColor={badgeBorder}
              px={2.5}
              py={1}
              borderRadius={'full'}
              spacing={1.5}
              title="Anlık Aktif Kullanıcı Durumu"
              transition="all 0.2s"
              _hover={{ borderColor: 'green.400' }}
            >
              <Box
                w="7px"
                h="7px"
                borderRadius="full"
                bg="#10b981"
                boxShadow="0 0 6px #10b981"
                animation={`${pulseAnimation} 2s infinite ease-in-out`}
              />
              <Text fontSize="xs" fontWeight="normal" color={textColor}>
                {i18n('Active Users:', 'options')}
              </Text>
              <Text fontSize="xs" fontWeight="bold" color={countColor}>
                {activeUsers}
              </Text>
            </HStack>
          </HStack>

          <HStack spacing={[3, 4, 5]} flexWrap={'wrap'}>
            <Link
              href={Links.website}
              isExternal
              _hover={{ color: hoverColor, textDecoration: 'none' }}
              display={'flex'}
              alignItems={'center'}
              gap={1}
            >
              <Icon as={BiGlobe} />
              <Text>Web Sitesi</Text>
            </Link>

            <Link
              href={Links.xProfile}
              isExternal
              _hover={{ color: hoverColor, textDecoration: 'none' }}
              display={'flex'}
              alignItems={'center'}
              gap={1}
            >
              <Icon as={FaXTwitter} />
              <Text>@HaYTo</Text>
            </Link>

            <Link
              href={Links.github}
              isExternal
              _hover={{ color: hoverColor, textDecoration: 'none' }}
              display={'flex'}
              alignItems={'center'}
              gap={1}
            >
              <Icon as={FaGithub} />
              <Text>GitHub</Text>
            </Link>

            <Link
              href={Links.privacy}
              isExternal
              _hover={{ color: hoverColor, textDecoration: 'none' }}
              display={'flex'}
              alignItems={'center'}
              gap={1}
            >
              <Icon as={BiShieldQuarter} />
              <Text>Gizlilik</Text>
            </Link>
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}

export default FootBar
