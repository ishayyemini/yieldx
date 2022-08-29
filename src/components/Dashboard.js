import { useLiveQuery } from 'dexie-react-hooks'

import { db } from '../data/db'
import { Box } from 'grommet'
import WarehouseWidget from './app/WarehouseWidget'

const Dashboard = () => {
  const warehouses = useLiveQuery(() => db.Warehouses?.toArray())
  const whAmounts = useLiveQuery(() => db.WHProdAmount?.toArray())

  const whHouse = [
    {
      temp: 25,
      eggsToday: 100,
      eggsTotal: 200,
      whName: 'HS01',
      trolleyCount: 2,
      humidity: 60,
      pressure: 1024,
      voc: 5.3,
    },
    {
      temp: 25,
      eggsToday: 100,
      eggsTotal: 200,
      whName: 'HS04',
      trolleyCount: 2,
      humidity: 60,
      pressure: 1024,
      voc: 5.3,
    },
    {
      temp: 25,
      eggsToday: 100,
      eggsTotal: 200,
      whName: 'HS03',
      trolleyCount: 2,
      humidity: 60,
      pressure: 1024,
      voc: 5.3,
    },
    {
      temp: 25,
      eggsToday: 100,
      eggsTotal: 200,
      whName: 'HS02',
      trolleyCount: 2,
      humidity: 60,
      pressure: 1024,
      voc: 5.3,
    },
  ]
  const whEggStorage = [
    {
      temp: 25,
      eggsToday: 100,
      eggsTotal: 200,
      whName: 'EG1',
      trolleyCount: 2,
      humidity: 60,
      pressure: 1024,
      voc: 5.3,
    },
    {
      temp: 25,
      eggsToday: 100,
      eggsTotal: 200,
      whName: 'EG2',
      trolleyCount: 2,
      humidity: 60,
      pressure: 1024,
      voc: 5.3,
    },
  ]
  const whLoadingRamp = [
    {
      temp: 25,
      eggsToday: 100,
      eggsTotal: 200,
      whName: 'LR1',
      trolleyCount: 2,
      humidity: 60,
      pressure: 1024,
      voc: 5.3,
    },
  ]

  return (
    <Box gap={'small'} pad={'small'} flex={'grow'} basis={'60%'}>
      {/*<Button label={'Add Eggs'} onClick={() => db.birthEggs()} />*/}
      <Box direction={'column'} flex gap={'small'}>
        <WarehouseWidget kind={'house'} warehouses={whHouse} />
        <WarehouseWidget kind={'eggStorage'} warehouses={whEggStorage} />
        <WarehouseWidget kind={'loadingRamp'} warehouses={whLoadingRamp} />
      </Box>
      <Box direction={'row'} basis={'100px'} justify={'stretch'} gap={'small'}>
        <WarehouseWidget kind={'garbage'} warehouses={[]} />
        <WarehouseWidget kind={'unknown'} warehouses={[]} />
      </Box>

      {/*<Box>*/}
      {/*  {whAmounts?.map((whAmount) => (*/}
      {/*    <Box pad={'small'} key={whAmount.WHID + whAmount.ProdID}>*/}
      {/*      {whAmount.Amount} eggs in{' '}*/}
      {/*      {warehouses?.find((wh) => wh.UID === whAmount.WHID)?.Name}*/}
      {/*    </Box>*/}
      {/*  ))}*/}
      {/*</Box>*/}
    </Box>
  )
}

export default Dashboard
