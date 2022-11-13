import { memo, useContext, useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import ReactFlow, {
  Background,
  Handle,
  MarkerType,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Box, Card, Text } from 'grommet'

import GlobalContext from './app/GlobalContext'
import API from '../data/API'
import { useTranslation } from 'react-i18next'

const initialNodes = []
const initialEdges = []

const whColors = {
  House: '#a2f9d8',
  Truck: '#6bcaef',
  EggStorage: '#fcb0d1',
  Setter: '#84f98c',
  HatchRoom: '#c283ef',
  ChickHall: '#f2e782',
}

const farmColors = {
  PSFarm: '#91300d',
  Hatchery: '#9b0f4c',
  BRFarm: '#11b26a',
}

const ProductNode = memo(({ data }) => {
  const { warehouses } = useContext(GlobalContext)
  const wh = warehouses[data.DestinationWH] ?? {}

  return (
    <Card margin={'none'} background={whColors[wh.Type]} width={'210px'}>
      {!data.start ? (
        <Handle type={'target'} position={'left'} isConnectable={false} />
      ) : null}
      <Box border={'bottom'}>
        <Text weight={'bold'} textAlign={'center'}>
          {wh.Name}
        </Text>
        <Text textAlign={'center'}>
          {new Date(data.CreateDate).toLocaleString('en-GB', {
            dateStyle: 'short',
            timeStyle: 'medium',
          })}
        </Text>
      </Box>
      <Box>
        <Text weight={'bold'} textAlign={'center'}>
          {data.Name} - {data.Amount}
        </Text>
      </Box>

      {!data.end ? (
        <Handle type={'source'} position={'right'} isConnectable={false} />
      ) : null}
    </Card>
  )
})

const FarmNode = memo(({ data }) => (
  <Box width={`${250 * data.whCount}px`} pad={{ horizontal: 'xsmall' }}>
    <Card
      height={`${Math.max(97, data.height) + 75}px`}
      background={farmColors[data.Type]}
      width={'100%'}
      margin={'none'}
    >
      {data.Name} - {data.Type}
    </Card>
  </Box>
))

const nodeTypes = { product: ProductNode, farm: FarmNode }

const ProductView = () => {
  const flowRef = useRef()
  const { warehouses, products } = useContext(GlobalContext)

  const { pathname } = useLocation()

  const UID = pathname.slice(pathname.indexOf('/product/') + 9)
  const product = products[UID]

  const { t } = useTranslation(null, { keyPrefix: 'productView' })

  useEffect(() => {
    API.getProductHistory(UID).then()
  }, [UID])

  const [nodes, setNodes] = useNodesState(initialNodes)
  const [edges, setEdges] = useEdgesState(initialEdges)

  const highest = useMemo(() => {
    if (product.History?.length)
      return Math.max(
        ...[
          ...(flowRef.current?.querySelectorAll('div[data-id*="product-"]') ||
            []),
        ].map((element) => element.clientHeight)
      )
    else return 0
  }, [product.History])

  useEffect(() => {
    if (product.History?.length) {
      const whNodes = product.History.map((item, index, array) => ({
        id: `product-${index}`,
        position: { x: index * 250, y: 50 },
        data: {
          ...item,
          start: index === 0,
          end: index === array.length - 1,
        },
        type: 'product',
      }))
      const farmNodes = product.History.reduce((array, item) => {
        const farm = warehouses[warehouses[item.DestinationWH]?.OwnerID]
        if (farm && farm.UID !== array.slice(-1)[0]?.data.UID)
          array.push({
            id: `farm-${array.length}`,
            position: { x: product.History.indexOf(item) * 250 - 20, y: 0 },
            data: { ...farm, whCount: 1, height: highest },
            type: 'farm',
          })
        else if (farm) array.slice(-1)[0].data.whCount++

        return array
      }, [])
      setNodes([...farmNodes, ...whNodes])
      setEdges(
        product.History.map((item, index) => ({
          id: `${index}-${index + 1}`,
          source: `product-${index}`,
          target: `product-${index + 1}`,
          style: { strokeWidth: 2 },
          markerEnd: { type: MarkerType.Arrow, strokeWidth: 2 },
          zIndex: 1,
        }))
      )
    }
  }, [highest, setNodes, setEdges, product.History, warehouses])

  return (
    <Box flex={'grow'} pad={'small'} gap={'small'}>
      <Card height={'50%'} pad={'none'} margin={'none'} overflow={'hidden'}>
        <Box
          style={{ position: 'absolute', zIndex: 10 }}
          pad={'small'}
          background={'inherit'}
          round={{ corner: 'top-left', size: 'small' }}
        >
          <Text weight={'bold'}>{t('productHistory')}</Text>
        </Box>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          fitView
          ref={flowRef}
        >
          <Background />
        </ReactFlow>
      </Card>
      <Card height={'50%'} margin={'none'}>
        <Text weight={'bold'}>{t('sensorHistory')}</Text>
      </Card>
    </Box>
  )
}

export default ProductView
