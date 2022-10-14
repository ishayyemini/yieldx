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
      this._setGlobalState((old) => {
        Object.entries(values).forEach(([key, value]) =>
          nestedProperty.set(old, key, value)
        )
        return old
      })
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
    const warehouses = await this.getWHAmounts(false).then((res) =>
      Object.fromEntries(res.map((item) => [item.UID, item]))
    )
    this._updateContext({ settings, warehouses })
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

  async getWHAmounts(update = true) {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/get-wh-amounts?' +
        queryString.stringify({ db: this._config.user })
    )
      .then((res) => res.json())
      .then((res) => {
        if (update)
          this._updateContext({
            warehouses: Object.fromEntries(res.map((item) => [item.UID, item])),
          })
        return res
      })
  }

  async getSensorHistory(wh, update = true) {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/get-sensor-history?' +
        queryString.stringify({ db: this._config.user, wh })
    )
      .then((res) => res.json())
      .then((res) => {
        if (update)
          this._updateContext({ [`warehouses.${wh}.SensorHistory`]: res })
        return res
      })
  }
}

const API = new APIClass()

export default API
