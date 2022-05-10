import { Main } from 'grommet'

import { CardWrapper, ChartCard } from './app/AppComponents'

const Dashboard = () => {
  return (
    <Main>
      <CardWrapper>
        <ChartCard />
        <ChartCard />
        <ChartCard />
      </CardWrapper>
    </Main>
  )
}

export default Dashboard
