import { useContext } from 'react'
import { useLocation } from 'react-router-dom'

import GlobalContext from './app/GlobalContext'

const WarehouseView = () => {
  const { warehouses } = useContext(GlobalContext)

  const { pathname } = useLocation()
  const UID = pathname.split('/').slice(-1)[0]

  return warehouses.find((item) => item.UID === UID)?.Name
}

export default WarehouseView
