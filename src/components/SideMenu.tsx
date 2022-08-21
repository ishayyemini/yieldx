import { FC } from 'react'
import { Box, Button, Nav, Sidebar } from 'grommet'
import * as Icons from 'grommet-icons'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <Box pad={'small'} flex={false}>
      <Sidebar round={'small'} background={'var(--main)'} gap={'medium'}>
        <Nav gap={'xsmall'}>
          <NavButton
            icon={<Icons.Fan />}
            label={'Parent Stock'}
            onClick={() => navigate('/')}
            selected={pathname === '/'}
          />
          <NavButton
            icon={<Icons.Car />}
            label={'Label Trolleys'}
            onClick={() => navigate('/label-trolleys')}
            selected={pathname === '/label-trolleys'}
          />
        </Nav>
      </Sidebar>
    </Box>
  )
}

export default SideMenu
