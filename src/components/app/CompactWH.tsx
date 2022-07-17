import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text } from 'grommet'
import styled from 'styled-components'

interface CompactWHProps {
  data: HouseData | EggStorageData | LoadingRampData | GarbageData | UnknownData
}

type HouseData = {
  kind: 'house'
  whName: string
  trolleyCount: number
  eggsTotal: number
  eggsToday: number
  temp: number
  humidity: number
  pressure: number
  voc: number
}

type EggStorageData = {
  kind: 'eggStorage'
  whName: string
  trolleyCount: number
  eggsTotal: number
  eggsToday: number
  temp: number
  humidity: number
  pressure: number
  voc: number
}

type LoadingRampData = {
  kind: 'loadingRamp'
  whName: string
  trolleyCount: number
  eggsTotal: number
  temp: number
  humidity: number
  pressure: number
  voc: number
}

type GarbageData = {
  kind: 'garbage'
  whName: string
  eggsTotal: number
  eggsToday: number
}

type UnknownData = {
  kind: 'unknown'
  whName: string
  trolleyCount: number
  eggsTotal: number
}

const Wrapper = styled(Box).attrs({
  background: { light: 'brand' },
  pad: 'small',
  round: 'small',
})`
  width: fit-content;
`

const CompactWH: FC<CompactWHProps> = ({ data: { kind, ...data } }) => {
  const { t } = useTranslation()

  const keyOrder: Array<string> = [
    'whName',
    'trolleyCount',
    'eggsTotal',
    'eggsToday',
    'temp',
    'humidity',
    'pressure',
    'voc',
  ]

  return (
    <Wrapper>
      {Object.entries(data)
        .sort(([a], [b]) => keyOrder.indexOf(a) - keyOrder.indexOf(b))
        .map(([key, value]) => (
          <Text key={key}>
            {t(`compactWH.${key}`)}: {value}
          </Text>
        ))}
    </Wrapper>
  )
}

export default CompactWH
