import { useCallback, useContext, useEffect } from 'react'
import { Box, Card, Text } from 'grommet'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import API from '../data/API'
import GlobalContext from './app/GlobalContext'

const keysToShow = [
  'Name',
  'Type',
  'AmountTotal',
  'Temp',
  'Humidity',
  'Baro',
  'CO2',
]

const lessKeys = ['Type', 'AmountTotal']

const layout = (length) => {
  if (length <= 2) return '100'
  else if (length <= 6) return '50'
  else if (length <= 9) return '32'
  else return '25'
}

const WarehouseList = () => {
  const { warehouses } = useContext(GlobalContext)
  /*
  What do we need to see here?
  Main page - warehouses, for each type display a chart - bar chart with total
  eggs and eggs today, and over it a line chart with sensor data.
  When clicking on any bar, we should expand to WarehouseView - what shall this
  entail?
  How often should this be updated? Indication of last update? Manual update?
   */

  // TODO Get Garbage and Unknown WHs
  // TODO Find way to simulate a lot more eggs
  // TODO Switch between PS and Hatchery

  const { t } = useTranslation(null, { keyPrefix: 'dashboard' })

  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const fetching = setInterval(() => API.getWHAmounts().then(), 15000)
    return () => clearInterval(fetching)
  }, [])

  const data = Object.values(warehouses)
    .filter(
      (item) =>
        item.OwnerID === pathname.slice(pathname.indexOf('/farm/') + 6) ||
        ['Grabage', 'Unknown'].includes(item.Type)
    )
    .slice(0, 12)

  const genCubes = useCallback(
    (type) =>
      data
        .filter((item) => item.Type === type)
        .map((item) => (
          <Card
            margin={['Grabage', 'Unknown'].includes(item.Type) ? 'none' : '6px'}
            basis={`calc(${layout(data.length)}% - 12px)`}
            justify={'center'}
            align={'center'}
            direction={'row'}
            onClick={() => navigate(`/warehouse/${item.UID}`)}
            hoverIndicator
            flex
            key={item.UID}
          >
            <Box pad={'small'}>
              {(['Grabage', 'Unknown'].includes(item.Type)
                ? lessKeys
                : keysToShow
              ).map((key) => (
                <Text size={'small'} key={key}>
                  {t(key)}:
                </Text>
              ))}
            </Box>
            <Box pad={'small'}>
              {(['Grabage', 'Unknown'].includes(item.Type)
                ? lessKeys
                : keysToShow
              ).map((key) => (
                <Text
                  size={'small'}
                  weight={['AmountTotal'].includes(key) ? 'bold' : 'normal'}
                  key={key}
                >
                  {['Temp', 'Humidity', 'Baro', 'CO2'].includes(key)
                    ? item[key] || '---'
                    : item[key]}
                  {key === 'Humidity' && item[key] ? '%' : ''}
                  {key === 'Temp' && item[key] ? '°C' : ''}
                </Text>
              ))}
            </Box>
          </Card>
        )),
    [navigate, data, t]
  )

  return (
    <Box gap={'small'} pad={'small'} flex={'grow'} basis={'60%'}>
      <Box
        direction={'row'}
        width={{ max: 'none', min: 'calc(100% + 12px)' }}
        margin={'-6px'}
        align={'stretch'}
        wrap
        flex
      >
        {genCubes('House')}
        {/*{genCubes('EggStorage')}*/}
        {genCubes('Loading Ramp')}
      </Box>
      <Box direction={'row'} basis={'100px'} justify={'stretch'} gap={'small'}>
        {genCubes('Grabage')}
        {genCubes('Unknown')}
      </Box>
    </Box>
  )
}

export default WarehouseList
