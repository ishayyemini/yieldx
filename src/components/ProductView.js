import { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import GlobalContext from './app/GlobalContext'
import API from '../data/API'

const ProductView = () => {
  const { products } = useContext(GlobalContext)

  const { pathname } = useLocation()

  const UID = pathname.slice(pathname.indexOf('/product/') + 9)
  const product = products[UID]

  useEffect(() => {
    API.getProductHistory(UID).then()
  }, [UID])

  console.log(product)

  return product.Name
}

export default ProductView
