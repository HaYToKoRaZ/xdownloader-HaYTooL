/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { getText as i18n } from '#libs/i18n'
import Links from '#pages/links'
import { StarIcon } from '@chakra-ui/icons'
import { Box, Button, HStack, Link, Text } from '@chakra-ui/react'
import React from 'react'
import { BiCoffeeTogo } from 'react-icons/bi'

const FootBar = () => {
  return (
    <Box
      position={'sticky'}
      bottom={0}
      width={'full'}
      fontSize={['1rem', '1rem', '1.5rem']}
      p={'0.5em'}
      bg={'brand.blue'}
    >
      <HStack justify={'center'} spacing={[4, 4, 4, 8]}>
        <Link href={Links.portal} _hover={{ textDecoration: 'none' }} isExternal>
          <Button
            colorScheme={'brand.pink'}
            color={'white'}
            data-testid="portal-button"
          >
            HaYTooL Portal ↗
          </Button>
        </Link>
      </HStack>
    </Box>
  )
}

export default FootBar
