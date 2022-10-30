import queryString from 'query-string'
import nestedProperty from 'nested-property'

class APIClass {
  _config = { user: '' }
  _setGlobalState

  configure({ user }, setGlobalState) {
    this._config = { user }
    if (setGlobalState) this._setGlobalState = setGlobalState
  }

  _updateContext(values) {
    if (typeof this._setGlobalState === 'function') {
      if (typeof values === 'object')
        this._setGlobalState((oldValues) => {
          const newValues = { ...oldValues }
          Object.entries(values).forEach(([key, value]) =>
            nestedProperty.set(newValues, key, value)
          )
          return newValues
        })
      else if (typeof values === 'function') this._setGlobalState(values)
    }
  }

  updateSettings({ mqttAddress, mqttPort }) {
    const oldSettings = JSON.parse(localStorage.getItem('settings') || '{}')
    localStorage.setItem(
      'settings',
      JSON.stringify({ ...oldSettings, mqttAddress, mqttPort })
    )
    this._updateContext({
      'settings.mqttAddress': mqttAddress,
      'settings.mqttPort': mqttPort,
    })
  }

  async loadUser() {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}')
    const [warehouses, products] = await this.getWHList(false).then((res) => [
      Object.fromEntries(res.warehouses.map((item) => [item.UID, item])),
      Object.fromEntries(res.products.map((item) => [item.UID, item])),
    ])
    this._updateContext({ settings, warehouses, products })
  }

  async login(user) {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/check-user?' +
        queryString.stringify({ db: user })
    ).then((res) => res.json())
  }

  async labelTrolleys({
    label1,
    label2,
    flock,
    sourceWH,
    destWH,
    rolling,
    date,
    mqttAddress,
    mqttPort,
  }) {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/label-trolleys?' +
        queryString.stringify({
          label1,
          label2,
          flock,
          sourceWH: sourceWH.length
            ? sourceWH.map((item) => `'${item}'`).toString()
            : null,
          destWH: destWH.length
            ? destWH.map((item) => `'${item}'`).toString()
            : null,
          rolling,
          date: new Date(date).toISOString().slice(0, 10),
          db: this._config.user,
          mqtt: mqttAddress && mqttPort && `mqtt://${mqttAddress}:${mqttPort}`,
        })
    ).then((res) => res.json())
  }

  async getFlockWHDate() {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/get-flock-wh-date?' +
        queryString.stringify({ db: this._config.user })
    ).then((res) => res.json())
  }

  async getWHList(update = true) {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/get-wh-list?' +
        queryString.stringify({ db: this._config.user })
    )
      .then((res) => res.json())
      .then((res) => {
        if (update)
          this._updateContext((oldData) => ({
            ...oldData,
            warehouses: Object.fromEntries(
              res.warehouses.map((wh) => [
                wh.UID,
                { ...oldData.warehouses?.[wh.UID], ...wh },
              ])
            ),
            products: Object.fromEntries(
              res.products.map((product) => [
                product.UID,
                { ...oldData.products?.[product.UID], ...product },
              ])
            ),
          }))
        return res
      })
  }

  async getWHAmounts(update = true) {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/get-wh-amounts?' +
        queryString.stringify({ db: this._config.user })
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (update)
          this._updateContext((oldData) => ({
            ...oldData,
            warehouses: Object.fromEntries(
              res.map((wh) => [
                wh.UID,
                { ...oldData.warehouses?.[wh.UID], ...wh },
              ])
            ),
          }))
        return res
      })
  }

  async getWHHistory(wh, update = true) {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/get-wh-history?' +
        queryString.stringify({ db: this._config.user, wh })
    )
      .then((res) => res.json())
      .then((res) => {
        if (update)
          this._updateContext((oldData) => ({
            ...oldData,
            warehouses: {
              ...oldData.warehouses,
              [wh]: { ...oldData.warehouses[wh], ...res },
            },
          }))
        return res
      })
  }

  async getProductHistory(uid, update = true) {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/get-product-history?' +
        queryString.stringify({ db: this._config.user, uid })
    )
      .then((res) => res.json())
      .then((res) => {
        if (update)
          this._updateContext((oldData) => ({
            ...oldData,
            products: {
              ...oldData.products,
              [uid]: { ...oldData.products[uid], History: res },
            },
          }))
        return res
      })
  }
}

const API = new APIClass()

export default API
