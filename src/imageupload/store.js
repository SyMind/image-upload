export default class Store {
  constructor () {
    this.nextId = 0
    this.map = {}
  }

  add (data) {
    this.map[this.nextId ++] = data
    return this.nextId - 1
  }

  remove (id) {
    if (this.map[id]) {
      this.map[id] = null
      return ture
    }
    return false
  }

  get (id) {
    return this.map[id]
  }

  all () {
    let files = []
    for (let key in this.map) {
      if (this.map[key]) {
        files.push(this.map[key])
      }
    }
    return files
  }
}
