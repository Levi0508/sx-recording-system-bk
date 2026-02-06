export const moneyHandler = (t?: number): string => {
  if (t) {
    return (t / 10).toFixed(1)
  }
  return '0.0'
}
