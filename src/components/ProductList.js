import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import 'reactflow/dist/style.css'

import GlobalContext from './app/GlobalContext'
import { Card } from 'grommet'

const ProductList = () => {
  const { warehouses, products } = useContext(GlobalContext)

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const UID = pathname.split('/')[2]

  const data = warehouses[UID] || {}

  return data.Products?.filter((prodID) => products[prodID]).map((prodID) => (
    <Card
      onClick={() => navigate(`/product/${prodID}`)}
      border={'bottom'}
      pad={'small'}
      flex={false}
      key={prodID}
      hoverIndicator
      height={{ max: '200px' }}
      weight={{ max: '200px' }}
    >
      {products[prodID].Name} - {products[prodID].Amount}
    </Card>
  ))
}

export default ProductList
