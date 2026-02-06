import moment from 'moment'

export * from './request'
export * from './policy-document'
export * from './policy-statement'

export const formatTimeStr = (t: string) => {
  return moment(t).format('YYYY-MM-DD HH:mm:ss')
}
