export const isObject = (obj: any) => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

export const deepCompare = (obj: any, compareObj: any) => {
  const compare: any = {}
  Object.keys(obj).forEach((key) => {
    const value = Reflect.get(obj, key)
    const compareValue = Reflect.get(compareObj, key)
    if (value && compareValue) {
      if (isObject(value) && isObject(compareValue)) {
        const compareNext = deepCompare(value, compareValue)
        if (Object.keys(compareNext).length !== 0) {
          compare[key] = compareNext
        }
      } else {
        if (value !== compareValue) {
          compare[key] = value
        }
      }
    }
  })

  return compare
}
