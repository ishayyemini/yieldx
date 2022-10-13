import { useContext, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Card, Text } from 'grommet'
import { useTranslation } from 'react-i18next'

import GlobalContext from './app/GlobalContext'

const keysToShow = ['Trolleys', 'AmountTotal', 'AmountToday']

const WarehouseView = () => {
  const { warehouses } = useContext(GlobalContext)

  const { t } = useTranslation(null, { keyPrefix: 'warehouseView' })

  const { pathname } = useLocation()
  const UID = pathname.split('/').slice(-1)[0]

  const data = warehouses.find((item) => item.UID === UID)

  /*
  Number of trolleys currently in House;
  Total number of eggs generated today;
  a graph of total number of eggs generated per each day, in past month (or maybe give an icon to change span to last week/last month/last year):
   */

  const series = useMemo(
    () => [
      {
        name: 'Eggs Total',
        type: 'bar',
        data: warehouses.map((wh) => ({
          x: wh.Name,
          y: wh.AmountTotal,
        })),
      },
      {
        name: 'Eggs Today',
        type: 'bar',
        data: warehouses.map((wh) => ({ x: wh.Name, y: wh.AmountToday })),
      },
    ],
    [warehouses]
  )

  return (
    <Box flex={'grow'} basis={'60%'} align={'center'}>
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
        </>
      ) : (
        <Card>{t('empty')}</Card>
      )}
    </Box>
  )
}

export default WarehouseView
