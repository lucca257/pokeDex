import axios from 'axios'

const api = axios.create({
  baseUrl: 'https://pokeapi.co/api/v2/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
})

export default api
