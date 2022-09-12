import { useEffect, useRef, useState } from 'react'
import API from './API'

const syncDB = (request, defaultData) => {
  const lastFetched = useRef('')

  const [data, setData] = useState(defaultData)

  useEffect(() => {
    API.getWHAmounts({ lastFetched: lastFetched.current }).then((res) => {
      lastFetched.current = new Date().toISOString()
      console.log(res)
    })
  }, [])

  // setInterval(() => {
  //   // request(lastFetched).then(res => )
  //
  // }, 15000)

  return { data }
}
