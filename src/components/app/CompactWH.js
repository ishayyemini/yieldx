import { useTranslation } from 'react-i18next'
import { Box, Text } from 'grommet'
import styled from 'styled-components'

const Wrapper = styled(Box).attrs({
  background: { light: 'brand' },
  pad: 'small',
  round: 'small',
})`
  width: fit-content;
`

const CompactWH = ({ data: { kind, ...data } }) => {
  const { t } = useTranslation()

  const keyOrder = [
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
