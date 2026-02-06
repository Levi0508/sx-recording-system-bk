import { HttpRequestConfig } from '@af-charizard/sdk-utils'
import { request } from './helpers'

//import//

export const services = {
  use: (config?: HttpRequestConfig) => {
    request.instance = request.create(config)
  },
  //export//
}
