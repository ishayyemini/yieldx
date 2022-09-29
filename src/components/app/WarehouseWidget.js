import { useMemo } from 'react'
import styled from 'styled-components'
import { Box } from 'grommet'
import { useTranslation } from 'react-i18next'
import Chart from 'react-apexcharts'

const Wrapper = styled(Box).attrs({
  background: { light: 'brand' },
  // pad: 'small',
  round: 'small',
})`
  //flex-direction: row;
  //> div {
  //  flex-basis: 50%;
  //}
`

const WarehouseWidget = ({ kind, warehouses }) => {
  const { t } = useTranslation(null, { keyPrefix: 'warehouseWidget' })

  // if (kind === 'House' || kind === 'EggStorage' || kind === 'garbage')
  // TODO calculate eggs today

  // if (kind === 'House' || kind === 'EggStorage' || kind === 'Loading Ramp')
  // TODO use sensors

  const series = useMemo(
    () => [
      {
        name: 'Eggs Total',
        type: 'bar',
        data: warehouses.map((wh) => ({
          x: wh.Name,
          y: wh.AmountTotal,
        })),
      },
      {
        name: 'Eggs Today',
        type: 'bar',
        data: warehouses.map((wh) => ({ x: wh.Name, y: wh.AmountToday })),
      },
    ],
    [warehouses]
  )

  return (
    <Wrapper flex>
      <Chart
        options={{
          chart: {
            id: kind,
            toolbar: { show: false },
            // stacked: true,
            zoom: { enabled: false },
          },
          legend: { show: false },
          title: { text: t(kind) },
          xaxis: { categories: warehouses.map((item) => item.Name) },
          yaxis: { min: 0 },
          // tooltip: {
          //   y: {
          //     formatter: (val, opts) =>
          //       opts.seriesIndex === 0
          //         ? opts.series[0][opts.dataPointIndex] +
          //           opts.series[1][opts.dataPointIndex]
          //         : val,
          //     title: {
          //       formatter: (seriesName) => seriesName,
          //     },
          //   },
          // },
        }}
        series={series}
        width={'100%'}
        height={'100%'}
      />
    </Wrapper>
  )
}

export default WarehouseWidget
