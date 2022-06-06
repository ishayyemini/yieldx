import { useLiveQuery } from 'dexie-react-hooks'
import { Box, Button, Main } from 'grommet'

import { db } from '../data/db'

const Dashboard = () => {
  const warehouses = useLiveQuery(() => db.Warehouses?.toArray())
  const whAmounts = useLiveQuery(() => db.WHProdAmount?.toArray())

  return (
    <Main>
      <Button label={'Add Eggs'} onClick={() => db.birthEggs()} />
      <Box>
        {whAmounts?.map((whAmount) => (
          <Box pad={'small'} key={whAmount.WHID + whAmount.ProdID}>
            {whAmount.Amount} eggs in{' '}
            {warehouses?.find((wh) => wh.UID === whAmount.WHID)?.Name}
          </Box>
        ))}
      </Box>
    </Main>
  )
}

export default Dashboard
