import { useContext } from 'react'
import { useLocation } from 'react-router-dom'

import GlobalContext from './app/GlobalContext'

const ProductView = () => {
  const { products } = useContext(GlobalContext)

  const { pathname } = useLocation()

  const product = products[pathname.slice(pathname.indexOf('/product/') + 9)]

  return product.Name
}

export default ProductView
