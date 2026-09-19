/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { getText as i18n } from '#libs/i18n'
import { Path } from '#pages/routes'
import type { TestableComponent } from '#pages/types/props'
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  VStack,
  useBoolean,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

interface MenuItemProps extends TestableComponent {
  name: string
  target: string
  closeMenu: () => void
}

const NavItem = (props: MenuItemProps) => {
  return (
    <Link
      to={props.target}
      as={RouterLink}
      onClick={props.closeMenu}
      _hover={{ textDecoration: 'none' }}
      data-testid={props.testId}
    >
      <Box
        p="0.5em 1.5em 0.5em 1.5em"
        _hover={{ bg: 'rgba(255, 255, 255, 0.33)' }}
        style={{ transition: 'background 300ms' }}
      >
        {props.name}
      </Box>
    </Link>
  )
}

type NavProps = {
  closeMenu: () => void
}

const Nav = ({ closeMenu }: NavProps) => {
  return (
    <VStack spacing={6} align="normal">
      <NavItem
        name={i18n('General', 'options:sideMenu')}
        target={Path.General}
        closeMenu={closeMenu}
        testId="nav-item-general"
      />
      <NavItem
        name={i18n('Features', 'options:sideMenu')}
        target={Path.Features}
        closeMenu={closeMenu}
        testId="nav-item-features"
      />
      <NavItem
        name={i18n('Integrations', 'options:sideMenu')}
        target={Path.Integrations}
        closeMenu={closeMenu}
        testId="nav-item-integrations"
      />
      <NavItem
        name={i18n('History', 'options:sideMenu')}
        target={Path.History}
        closeMenu={closeMenu}
        testId="nav-item-history"
      />
      <NavItem
        name={i18n('Diagnostics', 'options:sideMenu')}
        target={Path.Diagnostics}
        closeMenu={closeMenu}
        testId="nav-item-diagnostics"
      />
      <NavItem
        name={i18n('About', 'options:sideMenu')}
        target={Path.About}
        closeMenu={closeMenu}
        testId="nav-item-about"
      />
    </VStack>
  )
}

const SideMenu = () => {
  const menuWidth = '270px'
  const [isActive, setActive] = useBoolean(false)
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <Box pos="fixed" top={0} zIndex={'overlay'}>
        <Flex
          pos={'fixed'}
          top={0}
          bg={'brand.bg'}
          width={'full'}
          display={useBreakpointValue({
            base: 'inherit',
            lg: 'none',
          })}
        >
          <IconButton
            aria-label="Side menu"
            size={'lg'}
            variant="ghost"
            bg="transparent"
            color="white"
            _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}
            _active={{ bg: 'rgba(255, 255, 255, 0.2)' }}
            icon={<HamburgerIcon />}
            onClick={() => setActive.on()}
            data-testid="side-menu-burger"
          />
        </Flex>
        <Box
          height={'full'}
          width={'full'}
          pos={'fixed'}
          bg={'blackAlpha.600'}
          style={{ transition: 'background 300ms' }}
          hidden={!isActive}
          onClick={() => setActive.off()}
          data-testid="side-menu-dimmed"
        ></Box>
      </Box>
      <Flex
        fontSize={'1.5rem'}
        direction="column"
        width={menuWidth}
        bg={colorMode === 'dark' ? 'brand.bg' : 'gray.100'}
        color={colorMode === 'dark' ? 'white' : 'gray.800'}
        left={useBreakpointValue({
          base: isActive ? '0px' : `-${menuWidth}`,
          lg: '0px',
        })}
        borderRight={useBreakpointValue({
          base: 'unset',
          lg: '1px solid gray',
        })}
        top="0"
        position={['fixed', 'fixed', 'fixed', 'relative', 'relative']}
        height={'full'}
        zIndex={'modal'}
        style={{
          transition: 'left 200ms',
        }}
        overflowX={'hidden'}
        overflowY={'auto'}
      >
        <Box p="1.5rem 1.5rem 0.5rem 1.5rem">
          <HStack justify="space-between" align="center">
            <Text fontSize="1.1rem" fontWeight="bold" color="cyan.400">
              XDownloader
            </Text>
            <IconButton
              aria-label="Toggle Theme"
              icon={colorMode === 'dark' ? <SunIcon color="yellow.300" /> : <MoonIcon color="purple.500" />}
              size="sm"
              variant="ghost"
              onClick={toggleColorMode}
              title={colorMode === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
            />
          </HStack>
        </Box>
        <Box height="50px" />
        <Nav closeMenu={setActive.off} />
      </Flex>
    </>
  )
}

export default SideMenu
