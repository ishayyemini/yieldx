import { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Card, CardHeader, Text } from 'grommet'
import { useTranslation } from 'react-i18next'
import Chart from 'react-apexcharts'
import { ThreeDots } from 'react-loader-spinner'

import GlobalContext from './app/GlobalContext'
import API from '../data/API'
import { LoadingIndicator } from './app/AppComponents'

const keysToShow = ['Trolleys', 'AmountTotal']

const WarehouseView = () => {
  const { warehouses } = useContext(GlobalContext)

  const { t } = useTranslation(null, { keyPrefix: 'warehouseView' })

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const UID = pathname.split('/').slice(-1)[0]

  const data = warehouses[UID] || {}

  const [loading, toggleLoading] = useState(
    !data.EggHistory || !data.SensorHistory
  )

  /*
  Number of trolleys currently in House;
  Total number of eggs generated today;
  a graph of total number of eggs generated per each day, in past month (or maybe give an icon to change span to last week/last month/last year):
   */

  useEffect(() => {
    API.getWHHistory(UID).then(() => toggleLoading(false))
  }, [])

  const sensors = useMemo(
    () =>
      ['Temp', 'Humidity', 'Baro', 'CO2'].map((type) => ({
        name: t(`sensors.${type}`),
        type: 'line',
        data:
          data.SensorHistory?.slice(0, 300).map((wh) => [
            new Date(wh.DateModified).getTime(),
            wh[type],
          ]) ?? [],
      })),
    [data.SensorHistory]
  )

  const eggs = useMemo(
    () => [
      {
        name: t(`eggs.chart`),
        type: 'bar',
        data:
          data.EggHistory?.slice(0, 30).map((wh) => ({
            x: wh.DateAdded,
            y: Number(wh.DailyEggs),
          })) ?? [],
      },
    ],
    [data.EggHistory]
  )

  return (
    <Box
      flex={'grow'}
      pad={{ horizontal: 'small' }}
      basis={'60%'}
      align={'center'}
    >
      {data ? (
        <>
          <Box direction={'row'} margin={'small'} gap={'small'}>
            <Box gap={'small'}>
              <Card margin={'none'}>
                <Text weight={'bold'} textAlign={'center'}>
                  {data.Name} - {data.Type}
                </Text>
              </Card>

              <Card
                direction={'row'}
                margin={'none'}
                pad={{ vertical: 'medium', horizontal: 'small' }}
                flex={'grow'}
                align={'center'}
              >
                <Box pad={'small'}>
                  {keysToShow.map((key) => (
                    <Text key={key}>{t(key)}:</Text>
                  ))}
                </Box>
                <Box pad={'small'}>
                  {keysToShow.map((key) => (
                    <Text weight={'bold'} key={key}>
                      {data[key]}
                    </Text>
                  ))}
                </Box>
              </Card>
            </Box>

            <Card fill={'horizontal'} margin={'none'} flex>
              {loading ? (
                <LoadingIndicator overlay={false} loading />
              ) : (
                <Chart
                  options={{
                    chart: {
                      id: 'eggs',
                      toolbar: { show: false },
                      zoom: { enabled: false },
                    },
                    legend: { show: false },
                    title: { text: t('eggs.title') },
                    xaxis: { type: 'datetime' },
                  }}
                  series={eggs}
                  width={'100%'}
                  height={'100%'}
                />
              )}
            </Card>

            <Card
              margin={'none'}
              pad={'none'}
              height={{ max: '200px' }}
              overflow={'auto'}
            >
              <CardHeader
                background={'inherit'}
                style={{ top: 0, position: 'sticky', zIndex: 1 }}
                border={'bottom'}
                margin={'none'}
                pad={'small'}
              >
                <Text weight={'bold'}>{t('productList')}</Text>
              </CardHeader>
              {Object.values(data.Products ?? {}).map((item) => (
                <Box
                  onClick={() => navigate(`/product/${item.UID}`)}
                  border={'bottom'}
                  pad={'small'}
                  flex={false}
                  key={item.UID}
                  hoverIndicator
                >
                  {item.hasOwnProperty('Name') ? (
                    <>
                      {item.Name} - {item.Amount}
                    </>
                  ) : (
                    <Box align={'center'}>
                      <ThreeDots
                        height={'24px'}
                        width={'30px'}
                        color={'black'}
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </Card>
          </Box>

          <Card fill={'horizontal'} flex>
            {loading ? (
              <LoadingIndicator overlay={false} loading />
            ) : (
              sensors.slice(0, 3).map((item, index) => (
                <Chart
                  options={{
                    chart: {
                      id: item.name,
                      // toolbar: { show: false },
                      // zoom: { enabled: false },
                      // group: 'sensors',
                      type: 'line',
                    },
                    legend: { show: false },
                    title: { text: item.name },
                    xaxis: {
                      type: 'datetime',
                      labels: { format: 'dd MMM HH:mm:ss' },
                    },
                    dataLabels: { enabled: false },
                    tooltip: { x: { format: 'dd MMM HH:mm:ss' } },
                    colors: [['#008FFB', '#00E396', '#FEB019'][index]],
                  }}
                  series={[item]}
                  width={'100%'}
                  height={'33%'}
                  key={index}
                />
              ))
            )}
          </Card>
        </>
      ) : (
        <Card>{t('empty')}</Card>
      )}
    </Box>
  )
}

export default WarehouseView
