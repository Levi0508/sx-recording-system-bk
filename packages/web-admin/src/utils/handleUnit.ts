export const formatNumberWithW = (num: number): string => {
  const format = (n: number, unitLabel: string): string => {
    const result = (n / 10000).toFixed(1) // 将结果保留一位小数
    const formatted = result.replace(/\.0$/, '') // 去掉末尾的 .0
    return formatted + unitLabel
  }

  if (num >= 10000) {
    return format(num, '万')
  }
  return num.toString()
}
