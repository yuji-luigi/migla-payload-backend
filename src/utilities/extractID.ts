export function extractID(data: number | any): number {
  if (typeof data == 'number') {
    return data
  } else if (data && 'id' in data) {
    return data.id
  }
  throw new Error('the argument is not a valid collection document')
}
