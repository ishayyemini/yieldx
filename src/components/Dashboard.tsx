import { useLiveQuery } from 'dexie-react-hooks'
import { Box, Main } from 'grommet'

import { db } from '../data/db'

const Dashboard = () => {
  const warehouses = useLiveQuery(() => db.Warehouses?.toArray())

  return (
    <Main>
      {warehouses?.map((warehouse) => (
        <Box pad={'small'}>{warehouse.Name}</Box>
      ))}
    </Main>
  )
}

export default Dashboard
