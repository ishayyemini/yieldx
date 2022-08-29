import { Box, Card, CardBody, CardHeader, Text } from 'grommet'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const CardWrapper = ({ direction = 'row', ...props }) => {
  return <Box direction={direction} fill {...props} />
}

const ChartCard = () => {
  const data = {
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
