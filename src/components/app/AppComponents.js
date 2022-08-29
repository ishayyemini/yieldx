import { Box, Button, Card, CardBody, CardHeader, Layer, Text } from 'grommet'
import styled from 'styled-components'
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
import { MutatingDots } from 'react-loader-spinner'

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

const CHeader = styled(CardHeader)`
  font-weight: bold;
  font-size: 1.5em;
  height: 1.5em;
`

const FormButtons = ({ submit, clear }) => (
  <Box
    justify={'center'}
    direction={'row'}
    gap={'medium'}
    margin={{ top: 'large' }}
  >
    {clear ? (
      <Button
        label={typeof clear === 'string' ? clear : 'Reset'}
        type={'reset'}
        secondary
      />
    ) : null}
    {submit ? (
      <Button
        label={typeof submit === 'string' ? submit : submit ?? 'Submit'}
        type={'submit'}
        primary
      />
    ) : null}
  </Box>
)

const LoadingIndicator = ({ loading, overlay = true }) => {
  const element = (
    <MutatingDots
      height={'100'}
      width={'100'}
      color={'var(--accent1)'}
      secondaryColor={'var(--accent2)'}
      radius={'12.5'}
    />
  )

  return loading ? (
    overlay ? (
      <Layer background={'transparent'}>{element}</Layer>
    ) : (
      element
    )
  ) : null
}

export { CardWrapper, ChartCard, FormButtons, CHeader, LoadingIndicator }
