import queryString from 'query-string'

class APIClass {
  _config = { user: '' }
  _setGlobalState

  configure({ user }, setGlobalState) {
    this._config = { user }
    this._setGlobalState = setGlobalState
  }

  async login(user) {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/check-user?' +
        queryString.stringify({ db: user })
    ).then((res) => res.json())
  }

  async labelTrolleys({ label, flock, wh, date }) {
    return await fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/label-trolleys?' +
        queryString.stringify({
          label,
          flock,
          wh,
          date: new Date(date).toISOString().slice(0, 10),
          db: this._config.user,
        })
    ).then((res) => res.json())
  }
}

const API = new APIClass()

export default API
