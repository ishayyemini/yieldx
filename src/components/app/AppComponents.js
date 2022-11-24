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
import { useContext, useEffect, useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'

import GlobalContext from './GlobalContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const whColors = {
  House: '#a2f9d8',
  Truck: '#6bcaef',
  EggStorage: '#fcb0d1',
  Setter: '#84f98c',
  HatchRoom: '#c283ef',
  ChickHall: '#f2e782',
}

export const farmColors = {
  PSFarm: '#91300d',
  Hatchery: '#9b0f4c',
  BRFarm: '#11b26a',
}

const sensorColors = { Temp: '#008FFB', Humidity: '#00E396', Baro: '#FEB019' }

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

const SensorsChart = ({
  data,
  onClick = () => {},
  sensors: sensorList = ['Temp', 'Humidity', 'Baro', 'CO2'],
  prodHistory,
}) => {
  const { warehouses } = useContext(GlobalContext)

  const { t } = useTranslation(null, {
    keyPrefix: 'appComponents.sensorsChart',
  })

  const sensors = useMemo(
    () =>
      sensorList.map((type) => {
        let series = [
          {
            id: type,
            name: t(type),
            type: 'line',
            data:
              data
                ?.filter(
                  (_, index, array) =>
                    index % Math.round(array.length / 300) === 0
                )
                .map((item) => [
                  new Date(item.DateCreate).getTime(),
                  item[type],
                ]) ?? [],
            color: sensorColors[type],
          },
        ]
        const maxValue = Math.max(...series[0].data.map(([, val]) => val))

        if (prodHistory)
          series = series.concat(
            prodHistory.map((trans, index, array) => ({
              id: `trans-${index}`,
              data: [
                [new Date(trans.CreateDate).getTime(), maxValue],
                [
                  new Date(
                    array[index + 1]?.CreateDate ?? series[0].data[0][0]
                  ).getTime(),
                  maxValue,
                ],
              ],
              type: 'area',
              color: whColors[warehouses[trans.DestinationWH]?.Type],
            }))
          )
        return series
      }),
    [t, data, sensorList, prodHistory, warehouses]
  )

  return sensors.map((item, index, array) => (
    <Box
      height={`${100 / array.length}%`}
      onClick={() => onClick(item[0].id)}
      key={item[0].id}
    >
      <Chart
        options={{
          chart: {
            id: item[0].id,
            type: 'line',
            fontFamily: '"Lato", sans-serif',
            zoom: { enabled: array.length <= 1 },
            toolbar:
              array.length <= 1
                ? { offsetX: -50, offsetY: 5 }
                : { show: false },
            animations: { enabled: false },
          },
          stroke: { curve: 'smooth', width: 1 },
          legend: { show: false },
          title: { text: item[0].name },
          yaxis: {
            labels: {
              formatter: (value) =>
                Math.round(value) +
                (item[0].id === 'Humidity' ? '%' : '') +
                (item[0].id === 'Temp' ? '°C' : ''),
            },
            tickAmount: array.length > 1 ? 2 : 6,
            min: (min) => Math.floor(min),
            max: (max) => Math.ceil(max),
          },
          xaxis: {
            type: 'datetime',
            labels: { format: 'dd MMM' },
            tooltip: { enabled: false },
          },
          dataLabels: { enabled: false },
          tooltip: {
            custom: ({ seriesIndex, dataPointIndex, w }) => {
              const [x, y] = w.config.series[seriesIndex].data[dataPointIndex]
              const currentWH =
                warehouses[
                  prodHistory
                    ?.reverse()
                    .find((trans) => new Date(trans.CreateDate).getTime() < x)
                    ?.DestinationWH
                ] ?? {}

              return `<span>x - ${new Date(x).toLocaleString('en-GB', {
                dateStyle: 'short',
                timeStyle: 'medium',
              })}</span>
                      <span>y - ${y}</span>
                      <span>wh - ${currentWH.Name}</span>`
            },
          },
          colors: item.map((series) => series.color),
        }}
        series={item}
        width={'100%'}
        height={'100%'}
      />
    </Box>
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
