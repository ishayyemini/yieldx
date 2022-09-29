import { useCallback, useEffect, useState } from 'react'
import { Box } from 'grommet'

import API from '../data/API'
import WarehouseWidget from './app/WarehouseWidget'

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

  const fetchDB = useCallback(() => {
    API.getWHAmounts().then((res) => {
      setData(
        res
          .filter((item) => item.OwnerName === 'PS1')
          .map((item, index) =>
            index === 0
              ? { ...item, AmountToday: 2000, AmountTotal: 4000 }
              : item
          )
      )
    })
  }, [])

  useEffect(() => {
    fetchDB()
    // const fetching = setInterval(() => fetchDB(), 15000)
    // return () => clearInterval(fetching)
  }, [fetchDB])

  console.log(data)

  return (
    <Box gap={'small'} pad={'small'} flex={'grow'} basis={'60%'}>
      {/*<Button label={'Add Eggs'} onClick={() => db.birthEggs()} />*/}
      <Box direction={'column'} flex gap={'small'}>
        <WarehouseWidget
          kind={'House'}
          warehouses={data.filter((item) => item.Type === 'House')}
        />
        <WarehouseWidget
          kind={'EggStorage'}
          warehouses={data.filter((item) => item.Type === 'EggStorage')}
        />
        <WarehouseWidget
          kind={'Loading Ramp'}
          warehouses={data.filter((item) => item.Type === 'Loading Ramp')}
        />
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
