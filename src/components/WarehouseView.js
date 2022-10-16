import { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Card, Text } from 'grommet'
import { useTranslation } from 'react-i18next'
import Chart from 'react-apexcharts'

import GlobalContext from './app/GlobalContext'
import API from '../data/API'
import { LoadingIndicator } from './app/AppComponents'

const keysToShow = ['Trolleys', 'AmountTotal', 'AmountToday']

const WarehouseView = () => {
  const { warehouses } = useContext(GlobalContext)

  const { t } = useTranslation(null, { keyPrefix: 'warehouseView' })

  const { pathname } = useLocation()
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
      [0, 2, 3, 8].map((subType) => ({
        name: t(`sensors.${subType}`),
        type: 'line',
        data:
          data.SensorHistory?.filter((item) => item.SubType === subType)
            .slice(0, 100)
            .map((wh) => ({
              x: wh.DateModified,
              y: Number(wh.Value).toFixed(3),
            })) ?? [],
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
            x: wh.ReportDate,
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
          <Card>
            <Text weight={'bold'}>
              {data.Name} - {data.Type}
            </Text>
          </Card>

          <Card direction={'row'}>
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

          <Card fill={'horizontal'} flex>
            {loading ? (
              <LoadingIndicator overlay={false} loading />
            ) : (
              <Chart
                options={{
                  chart: {
                    id: 'sensors',
                    toolbar: { show: false },
                    zoom: { enabled: false },
                  },
                  legend: { show: false },
                  title: { text: t('sensors.title') },
                  xaxis: {
                    type: 'datetime',
                    labels: { format: 'dd MMM HH:mm:ss' },
                  },
                  tooltip: { x: { format: 'dd MMM HH:mm:ss' } },
                }}
                series={sensors}
                width={'100%'}
                height={'100%'}
              />
            )}
          </Card>

          <Card fill={'horizontal'} flex>
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
        </>
      ) : (
        <Card>{t('empty')}</Card>
      )}
    </Box>
  )
}

export default WarehouseView
