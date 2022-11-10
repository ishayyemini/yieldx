import { memo, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MiniMap,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Box, Card, Text } from 'grommet'

import GlobalContext from './app/GlobalContext'
import API from '../data/API'

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

const ProductNode = memo(({ data }) => {
  const { warehouses } = useContext(GlobalContext)
  const wh = warehouses[data.DestinationWH] ?? {}

  return (
    <Card
      margin={'none'}
      background={whColors[wh.Type]}
      width={{ max: '210px' }}
    >
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

const nodeTypes = { custom: ProductNode }

const ProductView = () => {
  const { products } = useContext(GlobalContext)

  const { pathname } = useLocation()

  const UID = pathname.slice(pathname.indexOf('/product/') + 9)
  const product = products[UID]

  useEffect(() => {
    API.getProductHistory(UID).then()
  }, [UID])

  const [nodes, setNodes] = useNodesState(initialNodes)
  const [edges, setEdges] = useEdgesState(initialEdges)

  useEffect(() => {
    if (product.History?.length) {
      setNodes(
        product.History.map((item, index, array) => ({
          id: index.toString(),
          position: { x: index * 250, y: 0 },
          data: {
            ...item,
            start: index === 0,
            end: index === array.length - 1,
          },
          type: 'custom',
        }))
      )
      setEdges(
        product.History.map((item, index) => ({
          id: `${index - 1}-${index}`,
          source: (index - 1).toString(),
          target: index.toString(),
        }))
      )
    }
  }, [setNodes, setEdges, product.History])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      nodesDraggable={false}
      nodesConnectable={false}
      nodesFocusable={false}
      edgesFocusable={false}
      fitView
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  )
}

export default ProductView
