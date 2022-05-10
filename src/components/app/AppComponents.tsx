import { FC } from 'react'
import {
  Box,
  BoxExtendedProps,
  Card,
  CardBody,
  CardHeader,
  Paragraph,
  Text,
} from 'grommet'

const CardWrapper: FC<BoxExtendedProps> = ({ direction = 'row', ...props }) => {
  return <Box direction={direction} fill {...props} />
}

type GraphCardProps = {}

const ChartCard: FC<GraphCardProps & BoxExtendedProps> = () => {
  return (
    <Card flex>
      <CardHeader>
        <Text weight={'bold'}>Header</Text>
      </CardHeader>
      <CardBody>
        <Paragraph>fjidjfoisj</Paragraph>
      </CardBody>
    </Card>
  )
}

export { CardWrapper, ChartCard }
