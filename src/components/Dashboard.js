import { useCallback, useEffect, useState } from 'react'
import { Box, Card, Text } from 'grommet'
import { useTranslation } from 'react-i18next'

import API from '../data/API'
import WarehouseWidget from './app/WarehouseWidget'

const keysToShow = [
  'Name',
  'Type',
  'AmountTotal',
  'AmountToday',
  'Temp',
  'Humidity',
  'Baro',
  'CO2',
]

const layout = (length) => {
  if (length <= 2) return '100'
  else if (length <= 6) return '50'
  else if (length <= 9) return '32'
  else return '25'
}

const Dashboard = () => {
  /*
  What do we need to see here?
  Main page - warehouses, for each type display a chart - bar chart with total
  eggs and eggs today, and over it a line chart with sensor data.
  When clicking on any bar, we should expand to WarehouseView - what shall this
  entail?
  How often should this be updated? Indication of last update? Manual update?
   */

  const [data, setData] = useState([])

  const { t } = useTranslation(null, { keyPrefix: 'dashboard' })

  const fetchDB = useCallback(() => {
    API.getWHAmounts().then((res) => {
      setData(
        res.filter(
          (item) =>
            ['House', 'EggStorage', 'Loading Ramp'].includes(item.Type) &&
            item.OwnerName === 'PS1'
        )
        // .map((item, index) =>
        //   index === 0
        //     ? { ...item, AmountToday: 2000, AmountTotal: 4000 }
        //     : item
        // )
      )
    })
  }, [])

  useEffect(() => {
    fetchDB()
    // const fetching = setInterval(() => fetchDB(), 15000)
    // return () => clearInterval(fetching)
  }, [fetchDB])

  const genCubes = useCallback(
    (type) =>
      data
        .filter((item) => item.Type === type)
        .map((item) => (
          <Card
            margin={'6px'}
            basis={`calc(${layout(data.length)}% - 12px)`}
            justify={'center'}
            align={'center'}
            direction={'row'}
            onClick={() => console.log(item.UID)}
            hoverIndicator
            flex
          >
            <Box pad={'small'}>
              {keysToShow.map((key) => (
                <Text size={'small'}>{t(key)}: </Text>
              ))}
            </Box>
            <Box pad={'small'}>
              {keysToShow.map((key) => (
                <Text
                  size={'small'}
                  weight={['AmountTotal'].includes(key) ? 'bold' : 'normal'}
                >
                  {['Temp', 'Humidity', 'Baro', 'CO2'].includes(key)
                    ? item[key]?.toFixed(2) || '---'
                    : item[key]}
                </Text>
              ))}
            </Box>
          </Card>
        )),
    [data, t]
  )

  console.log(data)

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
        {genCubes('EggStorage')}
        {genCubes('Loading Ramp')}
      </Box>
      <Box direction={'row'} basis={'100px'} justify={'stretch'} gap={'small'}>
        <WarehouseWidget
          kind={'Garbage'}
          warehouses={data.filter((item) => item.Type === 'Garbage')}
        />
        <WarehouseWidget
          kind={'Unknown'}
          warehouses={data.filter((item) => item.Type === 'Unknown')}
        />
      </Box>
    </Box>
  )
}

export default Dashboard
