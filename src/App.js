import { useCallback, useEffect, useState } from 'react'
import { Box, Grommet } from 'grommet'
import { createGlobalStyle, css } from 'styled-components'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Dashboard from './components/Dashboard'
import SideMenu from './components/SideMenu'
import { db } from './data/db'
import LabelTrolleys from './components/LabelTrolleys'
import SignIn from './components/auth/SignIn'
import GlobalContext from './components/app/GlobalContext'
import API from './data/API'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Lato';
    src: local('Lato'), url(./fonts/Lato-Regular.ttf) format('truetype');
  }

  body {
    font-family: "Lato", sans-serif;
    --main: #f9dec8ff;
    --accent1: #90e39aff;
    --accent2: #b26270ff;
    --active: #ddf093ff;
    --muted: #638475ff;
    --body: #E0E0E0;
  }
`

const theme = {
  global: {
    colors: {
      brand: 'var(--main)',
      'accent-1': 'var(--accent1)',
      'accent-2': 'var(--accent2)',
      muted: 'var(--muted)',
    },
  },
  card: {
    body: { pad: 'small' },
    container: {
      background: { light: 'brand', dark: 'dark-1' },
      margin: 'small',
      pad: 'small',
      round: 'medium',
      elevation: 'none',
      border: { color: { light: 'light-5' }, size: 'small' },
    },
    header: {
      margin: { bottom: 'small' },
      justify: 'center',
    },
  },
  button: {
    default: { font: { weight: 'bold' } },
    primary: {
      background: 'accent-1',
      font: { weight: 'bold' },
    },
    secondary: { background: 'muted', font: { weight: 'bold' } },
    hover: {
      extend: css`
        transition: opacity 0.2s;
        opacity: 0.7;
      `,
    },
  },
}

const App = () => {
  const [globalState, setGlobalState] = useState({ user: '' })
  const [authStage, setAuthStage] = useState('signIn')

  useEffect(() => {
    db.loadInitialData()
  }, [])

  useEffect(() => {
    API.configure({ user: globalState.user }, setGlobalState)
  }, [globalState.user])

  const loadUser = useCallback((user) => {
    setGlobalState((old) => ({ ...old, user }))
    setAuthStage('loggedIn')
  }, [])

  const signOut = useCallback(() => {
    setGlobalState({ user: '' })
    setAuthStage('signIn')
  }, [])

  return (
    <Grommet theme={theme} full>
      <Box direction={'row'} fill>
        <GlobalContext.Provider value={{ ...globalState, setGlobalState }}>
          <BrowserRouter>
            <GlobalStyle />

            {authStage === 'signIn' ? (
              <Routes>
                <Route path={'/'} element={<SignIn loadUser={loadUser} />} />
                <Route path={'*'} element={<Navigate replace to={'/'} />} />
              </Routes>
            ) : null}

            {authStage === 'loggedIn' ? (
              <>
                <SideMenu signOut={signOut} />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="label-trolleys" element={<LabelTrolleys />} />
                  <Route path={'*'} element={<Navigate replace to={'/'} />} />
                </Routes>
              </>
            ) : null}
          </BrowserRouter>
        </GlobalContext.Provider>
      </Box>
    </Grommet>
  )
}

export default App
