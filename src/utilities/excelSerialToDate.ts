export function excelSerialToDate(serial: number) {
  // Excel thinks 1900 was a leap year, so dates ≥ Mar 1 1900 are off by one
  const isLeapBug = serial < 60
  const offsetDays = isLeapBug ? 25569 : 25569 + 1
  // 86400 000 ms in a day
  const msPerDay = 86400 * 1000
  const utc = (serial - offsetDays) * msPerDay
  return new Date(utc)
}
