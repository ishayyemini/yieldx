import { FC, useEffect } from 'react'
import { Box, Grommet, ThemeType } from 'grommet'
import { createGlobalStyle } from 'styled-components'

import Dashboard from './components/Dashboard'
import SideMenu from './components/SideMenu'
import { db } from './data/db'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LabelTrolleys from './components/LabelTrolleys'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Lato';
    src: local('Lato'), url(./fonts/Lato-Regular.ttf) format('truetype');
  }

  body {
    font-family: "Lato", sans-serif;
    --main: #f9dec8ff;
    --accent1: #90e39aff;
    --accent2: #ce4760ff;
    --active: #ddf093ff;
    --muted: #638475ff;
    --body: #E0E0E0;
  }
`

const theme: ThemeType = {
  global: {
    colors: {
      brand: 'var(--main)',
      'accent-1': 'var(--accent1)',
      'accent-2': 'var(--accent2)',
    },
  },
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
  useEffect(() => {
    db.loadInitialData()
  }, [])

  return (
    <Grommet theme={theme} themeMode={'dark'} full>
      <GlobalStyle />

      <Box direction={'row'} fill>
        <BrowserRouter>
          <SideMenu />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="label-trolleys" element={<LabelTrolleys />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </Grommet>
  )
}

export default App
