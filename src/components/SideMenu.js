import { useContext } from 'react'
import { Box, Button, Nav, ResponsiveContext, Sidebar } from 'grommet'
import * as Icons from 'grommet-icons'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'

import GlobalContext from './app/GlobalContext'

const NavButtonStyled = styled(Button).attrs({
  plain: true,
  hoverIndicator: true,
})`
  padding: 11px 22px;
  border-radius: 18px;
  ${(props) => (props.selected ? 'background: var(--accent1);' : '')}

  > div {
    justify-content: start;
  }
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
  const size = useContext(ResponsiveContext)
  const { warehouses } = useContext(GlobalContext)

  const { pathname } = useLocation()

  const footerElements = (
    <>
      <NavButton icon={<Icons.Logout />} label={'Sign Out'} onClick={signOut} />
    </>
  )

  return (
    <Box
      pad={'small'}
      flex={false}
      style={{ position: 'sticky', top: 0, zIndex: 10 }}
    >
      <Sidebar
        round={'small'}
        background={'var(--main)'}
        gap={'medium'}
        direction={size === 'small' ? 'row' : 'column'}
        overflow={'auto'}
        footer={size !== 'small' ? footerElements : null}
      >
        <Nav
          direction={size === 'small' ? 'row' : 'column'}
          overflow={'auto'}
          gap={'xsmall'}
        >
          {Object.values(warehouses)
            .filter((wh) => ['PSFarm', 'BRFarm'].includes(wh.Type))
            .map((wh) => (
              <NavButton
                icon={<Icons.Dashboard />}
                label={wh.Name}
                to={`/farm/${wh.UID}`}
                key={wh.UID}
              />
            ))}
          {pathname.startsWith('/warehouse/') ? (
            <NavButton
              icon={<Icons.CloudSoftware />}
              label={
                warehouses[pathname.split('/').slice(-1)[0]]?.Name ||
                'Warehouse'
              }
              to={pathname}
            />
          ) : null}
          <NavButton
            icon={<Icons.Tag />}
            label={'Label Trolleys'}
            to={'/label-trolleys'}
          />
          <NavButton
            icon={<Icons.SettingsOption />}
            label={'Settings'}
            to={'/settings'}
          />
          {size === 'small' ? footerElements : null}
        </Nav>
      </Sidebar>
    </Box>
  )
}

export default SideMenu
