import { FC } from 'react'
import {
  Box,
  BoxExtendedProps,
  Card,
  CardBody,
  CardHeader,
  Text,
} from 'grommet'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const CardWrapper: FC<BoxExtendedProps> = ({ direction = 'row', ...props }) => {
  return <Box direction={direction} fill {...props} />
}

type GraphCardProps = {}

const ChartCard: FC<GraphCardProps & BoxExtendedProps> = () => {
  const data: ChartData<'bar'> = {
    labels: ['First', 'Second'],
    datasets: [{ label: 'Hey!', data: [20, 10] }],
  }

  return (
    <Card flex>
      <CardHeader>
        <Text weight={'bold'}>Header</Text>
      </CardHeader>
      <CardBody>
        <Bar data={data} />
      </CardBody>
    </Card>
  )
}

export { CardWrapper, ChartCard }
