export function extend (target, ...rest) {
  for (let i = 0; i < rest.length; i++) {
    let source = rest[i]
    for (let key in source) {
      target[key] = source[key]
    }
  }
  return target
}
