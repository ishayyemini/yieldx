import { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Grommet, ResponsiveContext } from 'grommet'
import { createGlobalStyle, css } from 'styled-components'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import SideMenu from './components/SideMenu'
import LabelTrolleys from './components/LabelTrolleys'
import SignIn from './components/auth/SignIn'
import GlobalContext from './components/app/GlobalContext'
import API from './data/API'
import Settings from './components/Settings'
import { LoadingIndicator } from './components/app/AppComponents'
import Dashboard from './components/Dashboard'

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
      round: 'small',
      elevation: 'none',
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
  checkBox: {
    border: { color: 'accent-2' },
    color: 'accent-2',
  },
}

const GrommetWrapper = (Element) => () => {
  return (
    <Grommet theme={theme} full>
      <Element />
    </Grommet>
  )
}

const App = () => {
  const size = useContext(ResponsiveContext)

  const [globalState, setGlobalState] = useState({
    user: '',
    settings: {},
  })
  const [authStage, setAuthStage] = useState('loading')

  // Load user from API on login/start
  const loadUser = useCallback(async () => {
    await API.loadUser()
  }, [])

  // On start
  useEffect(() => {
    const user = localStorage.getItem('user') ?? ''
    setGlobalState((old) => ({ ...old, user }))
    API.configure({ user }, setGlobalState)

    // Check if logged in
    if (user) {
      loadUser().then(() => setAuthStage('loggedIn'))
    } else {
      setAuthStage('signIn')
    }
  }, [loadUser])

  // After auth sign in
  const signIn = useCallback(
    async (user) => {
      localStorage.setItem('user', user)
      setGlobalState((old) => ({ ...old, user }))
      API.configure({ user })

      await loadUser()
      setAuthStage('loggedIn')
    },
    [loadUser]
  )

  const signOut = useCallback(() => {
    localStorage.setItem('user', '')
    localStorage.setItem('settings', '')
    setGlobalState({ user: '' })
    setAuthStage('signIn')
  }, [])

  return (
    <Box direction={size === 'small' ? 'column' : 'row'} fill>
      <GlobalContext.Provider value={{ ...globalState, setGlobalState }}>
        <BrowserRouter>
          <GlobalStyle />
          {authStage === 'loading' ? <LoadingIndicator loading /> : null}

          {authStage === 'signIn' ? (
            <Routes>
              <Route path={'/'} element={<SignIn signIn={signIn} />} />
              <Route path={'*'} element={<Navigate replace to={'/'} />} />
            </Routes>
          ) : null}

          {authStage === 'loggedIn' ? (
            <>
              <SideMenu signOut={signOut} />
              <Routes>
                <Route path={'/'} element={<Dashboard />} />
                <Route path={'label-trolleys'} element={<LabelTrolleys />} />
                <Route path={'settings'} element={<Settings />} />
                <Route
                  path={'*'}
                  element={<Navigate replace to={'/label-trolleys'} />}
                />
              </Routes>
            </>
          ) : null}
        </BrowserRouter>
      </GlobalContext.Provider>
    </Box>
  )
}

export default GrommetWrapper(App)
