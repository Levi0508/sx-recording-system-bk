import 'hls.js/dist/hls.min.js'
import '~/styles/global'
import { services } from '@af-charizard/sdk-services'
import { config } from '~/config'

services.use({
  baseURL: config.BASE_API,
})
