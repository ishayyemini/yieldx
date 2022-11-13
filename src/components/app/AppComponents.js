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
import { useEffect, useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'

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

const FormButtons = ({ submit, clear, submitCount }) => {
  const [oldCount, setOldCount] = useState(submitCount)
  const [submitted, toggleSubmitted] = useState(false)

  useEffect(() => {
    if (submitCount > oldCount) {
      setOldCount(submitCount)
      toggleSubmitted(true)
      setTimeout(() => toggleSubmitted(false), 1000)
    }
  }, [submitCount, oldCount])

  let submitLabel = 'Submit'
  if (typeof submit === 'string') submitLabel = submit
  else if (Array.isArray(submit)) submitLabel = submit[submitted ? 1 : 0]

  return (
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
      {submit ? <Button label={submitLabel} type={'submit'} primary /> : null}
    </Box>
  )
}

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
      <Layer background={'transparent'} responsive={false}>
        {element}
      </Layer>
    ) : (
      <Box align={'center'} justify={'center'} fill>
        {element}
      </Box>
    )
  ) : null
}

const SensorsChart = ({ data }) => {
  const { t } = useTranslation(null, {
    keyPrefix: 'appComponents.sensorsChart',
  })

  const sensors = useMemo(
    () =>
      ['Temp', 'Humidity', 'Baro', 'CO2'].map((type) => ({
        id: type,
        name: t(type),
        type: 'line',
        data:
          data
            ?.slice(0, 300)
            .map((item) => [new Date(item.DateCreate).getTime(), item[type]]) ??
          [],
      })),
    [data]
  )

  return sensors.slice(0, 3).map((item, index) => (
    <Chart
      options={{
        chart: {
          id: item.id,
          type: 'line',
          fontFamily: '"Lato", sans-serif',
        },
        stroke: { curve: 'smooth', width: 3 },
        legend: { show: false },
        title: { text: item.name },
        yaxis: {
          labels: {
            formatter: (value) =>
              value +
              (item.name === 'Humidity' ? '%' : '') +
              (item.name === 'Temp' ? '°C' : ''),
          },
          tickAmount: 3,
        },
        xaxis: { type: 'datetime', labels: { format: 'dd MMM' } },
        dataLabels: { enabled: false },
        tooltip: { x: { format: 'dd MMM HH:mm:ss' } },
        colors: [['#008FFB', '#00E396', '#FEB019'][index]],
      }}
      series={[item]}
      width={'100%'}
      height={'33%'}
      key={index}
    />
  ))
}

export {
  CardWrapper,
  ChartCard,
  FormButtons,
  CHeader,
  LoadingIndicator,
  SensorsChart,
}
