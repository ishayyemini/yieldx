import { useLocation } from 'react-router-dom'

const WarehouseView = () => {
  const { pathname } = useLocation()

  console.log(pathname.split('/').slice(-1)[0])
  return null
}

export default WarehouseView
