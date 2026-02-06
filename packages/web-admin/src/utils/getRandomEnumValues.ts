export const getRandomEnumValues = (
  enumObject: any,
  count: number,
): string[] => {
  const enumValues = Object.values(enumObject)
  const shuffled = enumValues.sort(() => 0.5 - Math.random()) // Shuffle array
  return shuffled.slice(0, count) as string[]
}
