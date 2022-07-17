import { FC } from 'react'
import { Box, Button, Nav, Sidebar } from 'grommet'
import * as Icons from 'grommet-icons'
import styled from 'styled-components'

const NavButton = styled(Button).attrs({
  plain: true,
  hoverIndicator: true,
})`
  padding: 11px 22px;
  border-radius: 18px;

  ${(props: { selected: boolean }) =>
    props.selected ? 'background: var(--accent1);' : ''}
`

const SideMenu: FC = () => {
  return (
    <Box pad={'small'} flex={false}>
      <Sidebar round={'small'} background={'var(--main)'} gap={'medium'}>
        <Nav gap={'xsmall'}>
          <NavButton icon={<Icons.Fan />} label={'Parent Stock'} selected />
          <NavButton icon={<Icons.Car />} label={'Another Screen'} />
        </Nav>
      </Sidebar>
    </Box>
  )
}

export default SideMenu
