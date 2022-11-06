import { useContext } from 'react'
import { Box, Button, ResponsiveContext, Sidebar, Text } from 'grommet'
import * as Icons from 'grommet-icons'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import GlobalContext from './app/GlobalContext'

const NavButtonStyled = styled(Button).attrs({
  plain: true,
  hoverIndicator: true,
  margin: { bottom: 'xsmall' },
})`
  padding: 11px 22px;
  border-radius: 18px;
  ${(props) => (props.selected ? 'background: var(--accent1);' : '')}

  > div {
    justify-content: start;
  }
`

const DynamicNav = styled(Box).attrs({
  direction: 'none',
  flex: 'none',
})`
  height: 100%;
  width: 690px;
  left: -${(props) => props.page * 230}px;
  position: relative;
  transition: left 0.3s;

  > div {
    width: 200px;
    margin-right: 30px;
    flex: none;
  }
`

const NavHeader = styled(Text).attrs({
  weight: 'bold',
  margin: { vertical: 'small', horizontal: 'medium' },
})``

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
  const { warehouses, products } = useContext(GlobalContext)

  const { pathname } = useLocation()

  const { t } = useTranslation(null, { keyPrefix: 'sideMenu' })

  const footerElements = (
    <>
      <NavButton icon={<Icons.Logout />} label={'Sign Out'} onClick={signOut} />
    </>
  )

  const currentProduct =
    products[pathname.slice(pathname.indexOf('/product/') + 9)]

  const currentWarehouse =
    warehouses[pathname.slice(pathname.indexOf('/warehouse/') + 11)] ||
    warehouses[currentProduct?.WHID]

  const currentFarm =
    warehouses[pathname.slice(pathname.indexOf('/farm/') + 6)] ||
    warehouses[currentWarehouse?.OwnerID]

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
        // flex={false}
        footer={size !== 'small' ? footerElements : null}
      >
        <Box width={{ max: '200px', min: '200px' }} overflow={'hidden'} fill>
          <DynamicNav
            page={0 + (currentWarehouse ? 1 : 0) + (currentProduct ? 1 : 0)}
          >
            <Box>
              <NavHeader>{t('farms')}</NavHeader>
              {Object.values(warehouses)
                .filter((wh) => ['PSFarm', 'BRFarm'].includes(wh.Type))
                .map((wh) => (
                  <NavButton
                    icon={<Icons.Organization />}
                    label={wh.Name}
                    to={`/farm/${wh.UID}`}
                    key={wh.UID}
                  />
                ))}
              <Box flex={'grow'} />
              <NavHeader>{t('general')}</NavHeader>
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
            </Box>

            <Box>
              <NavButton
                icon={<Icons.LinkPrevious />}
                label={'Back'}
                to={`/farm/${currentFarm.UID}`}
              />
              <NavHeader>{t('warehouses')}</NavHeader>
              {Object.values(warehouses)
                .filter((wh) => wh.OwnerID === currentFarm.UID)
                .map((wh) => (
                  <NavButton
                    icon={<Icons.Home />}
                    label={wh.Name}
                    to={`/warehouse/${wh.UID}`}
                    key={wh.UID}
                  />
                ))}
            </Box>

            <Box>
              <NavButton
                icon={<Icons.LinkPrevious />}
                label={'Back'}
                to={`/warehouse/${currentWarehouse?.UID}`}
              />
              <NavHeader>{t('products')}</NavHeader>
              {currentWarehouse?.Products?.filter((uid) => products[uid]).map(
                (uid) => (
                  <NavButton
                    icon={<Icons.Cart />}
                    label={products[uid].Name}
                    to={`/product/${uid}`}
                    key={uid}
                  />
                )
              )}
            </Box>
          </DynamicNav>
        </Box>
      </Sidebar>
    </Box>
  )
}

export default SideMenu
