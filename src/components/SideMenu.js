import { useContext, useEffect, useMemo, useState } from 'react'
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
  direction: 'row',
  flex: false,
})`
  height: 100%;
  width: ${(props) => (props.menuWidth + 30) * 3}px;
  left: -${(props) => props.page * (props.menuWidth + 30)}px;
  position: relative;
  transition: left 0.3s;

  > div {
    width: ${(props) => props.menuWidth}px;
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

/*
Farm list 
Farm -> Warehouse list
        Farm summary
          
        Warehouse -> Product list
                     Filter by alerts
                     Label products
                     Warehouse summary
                     
                     Product -> Product summary
 */

const SideMenu = ({ signOut }) => {
  const small = 'small' === useContext(ResponsiveContext)
  const { warehouses, products } = useContext(GlobalContext)

  const [open, toggleOpen] = useState(false)

  const { pathname } = useLocation()

  const menuWidth = useMemo(
    () => (small ? window.innerWidth - 24 : 210),
    [small]
  )

  useEffect(() => {
    toggleOpen(false)
  }, [small])

  const { t } = useTranslation(null, { keyPrefix: 'sideMenu' })

  const footerElements = (
    <>
      <Box border={'top'} margin={{ top: 'small' }} />
      <NavButton icon={<Icons.Logout />} label={'Sign Out'} onClick={signOut} />
    </>
  )

  const currentProduct =
    products[pathname.slice(pathname.indexOf('/product/') + 9)]

  const currentWarehouse =
    (pathname.startsWith('/warehouse/') &&
      warehouses[pathname.split('/')[2]]) ||
    warehouses[currentProduct?.WHID]

  const currentFarm =
    warehouses[pathname.slice(pathname.indexOf('/farm/') + 6)] ||
    warehouses[currentWarehouse?.OwnerID]

  return (
    <Box
      pad={'small'}
      flex={false}
      height={{ max: small && !open ? '70px' : '100%' }}
      style={{ position: 'sticky', top: 0, zIndex: 10 }}
      overflow={'hidden'}
    >
      <Sidebar
        round={'small'}
        background={'var(--main)'}
        gap={'medium'}
        footer={small ? footerElements : null}
        height={{ min: 'fit-content' }}
        flex={false}
      >
        <Box width={{ max: menuWidth + 'px', min: menuWidth + 'px' }}>
          {small ? (
            <Button
              icon={open ? <Icons.Close /> : <Icons.Menu />}
              onClick={() => toggleOpen((open) => !open)}
              style={{
                position: 'absolute',
                right: '6px',
                zIndex: 1,
                height: '50px',
              }}
            />
          ) : null}

          <DynamicNav
            page={
              0 +
              (currentFarm ? 1 : 0) +
              (currentWarehouse ? 1 : 0) +
              (currentProduct ? 1 : 0)
            }
            menuWidth={menuWidth}
          >
            <Box>
              <NavHeader>{t('farms')}</NavHeader>
              <NavHeader>
                {t('total')} -{' '}
                {Object.values(warehouses).reduce(
                  (total, wh) => total + wh.AmountTotal,
                  0
                ) ?? 0}
              </NavHeader>
              <NavButton
                icon={<Icons.Projects />}
                label={t('farmList')}
                to={`/`}
              />
              <Box border={'top'} margin={{ top: 'small' }} />

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
            </Box>

            <Box>
              <NavButton
                icon={<Icons.LinkPrevious />}
                label={t('backToFarms')}
                to={`/`}
              />
              <Box border={'top'} />

              <NavHeader>
                {currentFarm?.Name} - {currentFarm?.Type}
              </NavHeader>
              <NavHeader>
                {t('total')} -{' '}
                {Object.values(warehouses).reduce(
                  (total, wh) =>
                    total +
                    (wh.OwnerID === currentFarm?.UID ? wh.AmountTotal : 0),
                  0
                ) || 0}
              </NavHeader>
              <NavButton
                icon={<Icons.Projects />}
                label={t('warehouseList')}
                to={`/farm/${currentFarm?.UID}`}
              />
            </Box>

            <Box>
              <NavButton
                icon={<Icons.LinkPrevious />}
                label={t('backToWarehouses')}
                to={`/farm/${currentFarm?.UID}`}
              />
              <Box border={'top'} />

              <NavHeader>
                {currentWarehouse?.Name} - {currentWarehouse?.Type}
              </NavHeader>
              <NavHeader>
                {t('total')} - {currentWarehouse?.AmountTotal ?? 0}
              </NavHeader>
              <NavHeader>
                {t('trolleys')} - {currentWarehouse?.Trolleys ?? 0}
              </NavHeader>
              <NavButton
                icon={<Icons.LineChart />}
                label={t('whOverview')}
                to={`/warehouse/${currentWarehouse?.UID}`}
              />
              <NavButton
                icon={<Icons.Cubes />}
                label={t('productList')}
                to={`/warehouse/${currentWarehouse?.UID}/products`}
              />
            </Box>

            <Box>
              <NavButton
                icon={<Icons.LinkPrevious />}
                label={t('backToWH')}
                to={`/warehouse/${currentWarehouse?.UID}`}
              />
            </Box>
          </DynamicNav>
        </Box>
      </Sidebar>
    </Box>
  )
}

export default SideMenu
