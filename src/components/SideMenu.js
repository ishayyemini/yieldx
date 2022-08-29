import { Box, Button, Nav, Sidebar } from 'grommet'
import * as Icons from 'grommet-icons'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'

const NavButtonStyled = styled(Button).attrs({
  plain: true,
  hoverIndicator: true,
})`
  padding: 11px 22px;
  border-radius: 18px;

  ${(props) => (props.selected ? 'background: var(--accent1);' : '')}
`

const NavButton = ({ to, ...props }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <NavButtonStyled
      onClick={to ? () => navigate(to) : null}
      selected={pathname === to}
      {...props}
    />
  )
}

const SideMenu = ({ signOut }) => {
  return (
    <Box pad={'small'} flex={false}>
      <Sidebar
        round={'small'}
        background={'var(--main)'}
        gap={'medium'}
        footer={
          <NavButton
            icon={<Icons.Logout />}
            label={'Sign Out'}
            onClick={signOut}
          />
        }
      >
        <Nav gap={'xsmall'}>
          <NavButton icon={<Icons.Fan />} label={'Parent Stock'} to={'/'} />
          <NavButton
            icon={<Icons.Car />}
            label={'Label Trolleys'}
            to={'/label-trolleys'}
          />
        </Nav>
      </Sidebar>
    </Box>
  )
}

export default SideMenu
