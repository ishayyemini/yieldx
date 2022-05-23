import { FC } from 'react'
import { Box, Grommet, ThemeType } from 'grommet'
import { createGlobalStyle } from 'styled-components'

import Dashboard from './components/Dashboard'
import SideMenu from './components/SideMenu'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Lato';
    src: local('Lato'), url(./fonts/Lato-Regular.ttf) format('truetype');
  }

  body {
    font-family: "Lato", sans-serif;
  }
`

const theme: ThemeType = {
  card: {
    body: { pad: 'small' },
    container: {
      background: { light: 'light-1', dark: 'dark-1' },
      margin: 'small',
      round: '4px',
      border: { color: { light: 'light-5' }, size: 'small' },
    },
    header: {
      pad: 'small',
      background: { light: 'light-3', dark: 'dark-3' },
      border: {
        color: { light: 'light-5' },
        size: 'small',
        side: 'bottom',
      },
    },
  },
}

const App: FC = () => {
  return (
    <Grommet theme={theme} themeMode={'dark'} full>
      <GlobalStyle />

      <Box direction={'row'} fill>
        <SideMenu />
        <Dashboard />
      </Box>
    </Grommet>
  )
}

export default App
