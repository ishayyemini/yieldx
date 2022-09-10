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
    this._updateContext({ settings })
  }

  async login(user) {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/check-user?' +
        queryString.stringify({ db: user })
    ).then((res) => res.json())
  }

  async labelTrolleys({ label, flock, wh, date, mqttAddress, mqttPort }) {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/label-trolleys?' +
        queryString.stringify({
          label,
          flock,
          wh,
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
}

const API = new APIClass()

export default API
