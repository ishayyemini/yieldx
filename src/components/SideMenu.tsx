import { FC } from 'react'
import { Box, Button, Nav, Sidebar } from 'grommet'
import * as Icons from 'grommet-icons'
import styled from 'styled-components/macro'

const NavButton = styled(Button).attrs({ plain: true, hoverIndicator: true })`
  padding: 11px 22px;
`

const SideMenu: FC = () => {
  return (
    <Box pad={'small'} flex={false}>
      <Sidebar round={'small'} background={'brand'} gap={'medium'}>
        <Nav gap={'xsmall'}>
          <NavButton icon={<Icons.Fan />} label={'Parent Stock'} primary />
          <NavButton icon={<Icons.Car />} label={'Another Screen'} />
        </Nav>
      </Sidebar>
    </Box>
  )
}

export default SideMenu
