import { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Card } from 'grommet'
import { useTranslation } from 'react-i18next'
import Chart from 'react-apexcharts'

import GlobalContext from './app/GlobalContext'
import API from '../data/API'
import { LoadingIndicator, SensorsChart } from './app/AppComponents'

const WarehouseView = () => {
  const { warehouses, products } = useContext(GlobalContext)

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
  }, [UID])

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
    [t, data.EggHistory]
  )

  console.log(products)

  return (
    <Box flex={'grow'} pad={'small'} basis={'60%'} align={'center'}>
      {data ? (
        <>
          <Card
            fill={'horizontal'}
            margin={{ bottom: 'small' }}
            flex={{ grow: 1 }}
          >
            {loading ? (
              <LoadingIndicator overlay={false} loading />
            ) : (
              <Chart
                options={{
                  chart: {
                    id: 'eggs',
                    toolbar: { show: false },
                    zoom: { enabled: false },
                    fontFamily: '"Lato", sans-serif',
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

          <Card margin={'none'} fill={'horizontal'} flex={{ grow: 5 }}>
            {loading ? (
              <LoadingIndicator overlay={false} loading />
            ) : (
              <SensorsChart data={data.SensorHistory} />
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
