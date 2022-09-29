import { useMemo } from 'react'
import styled from 'styled-components'
import { Box } from 'grommet'
import { useTranslation } from 'react-i18next'
import { Chart } from 'react-charts'

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

  // if (kind === 'House' || kind === 'EggStorage' || kind === 'garbage')
  // TODO calculate eggs today

  // if (kind === 'House' || kind === 'EggStorage' || kind === 'Loading Ramp')
  // TODO use sensors

  const data = useMemo(
    () => [
      {
        label: 'React Charts',
        data: warehouses,
      },
    ],
    [warehouses]
  )

  const primaryAxis = useMemo(
    () => ({
      getValue: (datum) => datum.Name,
      elementType: 'linear',
    }),
    []
  )

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (datum) => datum.AmountToday,
        elementType: 'area',
        min: 0,
      },
      {
        getValue: (datum) => datum.AmountTotal,
        elementType: 'bar',
        min: 0,
      },
    ],
    []
  )

  return (
    <Wrapper flex>
      {t(`warehouseWidget.${kind}`)}
      {warehouses.length ? (
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
            padding: { left: 0, right: 20, bottom: 10 },
          }}
        />
      ) : null}
    </Wrapper>
  )
}

export default WarehouseWidget
