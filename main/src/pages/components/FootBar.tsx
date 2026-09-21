/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Links from '#pages/links'
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
import React from 'react'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import { BiGlobe, BiShieldQuarter } from 'react-icons/bi'

const FootBar = () => {
  const bg = useColorModeValue('whiteAlpha.800', 'blackAlpha.400')
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const textColor = useColorModeValue('gray.500', 'gray.400')
  const hoverColor = useColorModeValue('brand.blue', 'twitter.300')

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
          <HStack spacing={2}>
            <Text fontWeight={'semibold'} color={textColor}>
              XDownloader HaYTooL
            </Text>
            <Text>v{getFullVersion()}</Text>
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
