import dayjs from 'dayjs'

export const formatDate = (t?: string): any => {
  return t && dayjs(t).format('YYYY-MM-DD')
}

export const formatDateM = (t?: string): any => {
  return t && dayjs(t).format('YYYYMM')
}
export const formatDate_M = (t?: string): any => {
  return dayjs(t).format('YYYY-MM')
}
export const formatDateHMS = (t?: string): any => {
  return t && dayjs(t).format('YYYY-MM-DD HH:mm:ss')
}
export const formatDateHM = (t?: string): any => {
  return t && dayjs(t).format('YYYY-MM-DD HH:mm')
}

export const formatDateHMSStart = (t?: string): any => {
  return t && dayjs(t).format('YYYY-MM-DD 00:00:00')
}
export const formatDateHMSEnd = (t?: string): any => {
  return t && dayjs(t).format('YYYY-MM-DD 23:59:59')
}

export const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
