export function toFixedWithoutRounding(num: number, decimals = 2) {
  const factor = Math.pow(10, decimals)
  return (Math.floor(num * factor) / factor).toFixed(decimals)
}
