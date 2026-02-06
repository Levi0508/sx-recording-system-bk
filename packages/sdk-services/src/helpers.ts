import { Request } from '@af-charizard/sdk-utils'

export const request = new Request({
  baseURL: '',
  timeout: 500000000,
  headers: {
    'Content-Type': 'application/json',
  },
})
