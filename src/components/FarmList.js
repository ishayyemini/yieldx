import { useContext } from 'react'
import { Box, Card, Text } from 'grommet'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import GlobalContext from './app/GlobalContext'

const keysToShow = ['Name', 'Type', 'AmountTotal']

const layout = (length) => {
  if (length <= 2) return '100'
  else if (length <= 6) return '50'
  else if (length <= 9) return '32'
  else return '25'
}

const FarmList = () => {
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

  const { t } = useTranslation(null, { keyPrefix: 'farmList' })

  const navigate = useNavigate()

  // useEffect(() => {
  //   const fetching = setInterval(() => API.getWHAmounts().then(), 15000)
  //   return () => clearInterval(fetching)
  // }, [])

  const data = Object.values(warehouses)
    .filter((item) => ['PSFarm', 'Hatchery', 'BRFarm'].includes(item.Type))
    .map((item) => ({
      ...item,
      AmountTotal: Object.values(warehouses).reduce(
        (total, wh) => total + (wh.OwnerID === item.UID ? wh.AmountTotal : 0),
        0
      ),
    }))

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
        {data.map((item) => (
          <Card
            margin={'6px'}
            basis={`calc(${layout(data.length)}% - 12px)`}
            justify={'center'}
            align={'center'}
            direction={'row'}
            onClick={() => navigate(`/farm/${item.UID}`)}
            hoverIndicator
            flex
            key={item.UID}
          >
            <Box pad={'small'}>
              {keysToShow.map((key) => (
                <Text size={'small'} key={key}>
                  {t(key)}:
                </Text>
              ))}
            </Box>
            <Box pad={'small'}>
              {keysToShow.map((key) => (
                <Text size={'small'} weight={'bold'} key={key}>
                  {item[key]}
                </Text>
              ))}
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default FarmList
