import { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

import GlobalContext from './app/GlobalContext'
import API from '../data/API'

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
]

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

const ProductView = () => {
  const { products } = useContext(GlobalContext)

  const { pathname } = useLocation()

  const UID = pathname.slice(pathname.indexOf('/product/') + 9)
  const product = products[UID]

  useEffect(() => {
    API.getProductHistory(UID).then()
  }, [UID])

  console.log(product)

  const [nodes, setNodes] = useNodesState(initialNodes)
  const [edges, setEdges] = useEdgesState(initialEdges)

  useEffect(() => {
    if (product.History?.length) {
      setNodes(
        product.History.map((item, index, array) => ({
          id: index.toString(),
          position: { x: index * 200, y: 0 },
          data: { label: item.Name },
          targetPosition: index !== 0 ? 'left' : 'none',
          sourcePosition: index !== array.length - 1 ? 'right' : 'none',
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
  }, [setNodes, product.History])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
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
