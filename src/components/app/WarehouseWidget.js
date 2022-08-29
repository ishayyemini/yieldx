import styled from 'styled-components'
import { Box } from 'grommet'
import { useTranslation } from 'react-i18next'
import Chart from 'react-apexcharts'

const Wrapper = styled(Box).attrs({
  background: { light: 'brand' },
  pad: 'small',
  round: 'small',
})`
  //flex-direction: row;
  //> div {
  //  flex-basis: 50%;
  //}
`

const WarehouseWidget = ({ kind, warehouses }) => {
  const { t } = useTranslation()

  const whNames = warehouses.map((wh) => wh.whName)
  const series = [
    {
      name: 'eggsTotal',
      type: 'bar',
      data: warehouses.map((wh) => ({ x: wh.whName, y: wh.eggsTotal })),
    },
  ]

  if (kind === 'house' || kind === 'eggStorage' || kind === 'garbage')
    series.push({
      name: 'eggsToday',
      type: 'bar',
      data: warehouses.map((wh) => ({ x: wh.whName, y: wh.eggsToday })),
    })

  if (kind === 'house' || kind === 'eggStorage' || kind === 'loadingRamp')
    series.concat(
      ['temp', 'humidity', 'pressure'].map((key) => ({
        name: key,
        type: 'line',
        data: warehouses.map((wh) => ({ x: wh.whName, y: wh[key] })),
      }))
    )

  return (
    <Wrapper flex>
      {/*{t(`warehouseWidget.${kind}`)}*/}
      <Chart
        options={{
          chart: { id: kind },
          xaxis: { categories: whNames },
        }}
        series={series}
        type="bar"
        width={500}
        // height={320}
      />
    </Wrapper>
  )
}

export default WarehouseWidget
