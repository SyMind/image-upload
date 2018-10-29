import Dragable from '../Dragable/index'

export default class Wrapper {
  constructor(el, options) {
    this.el = el
    this.options = options

    this.slots = []
    this.lastIdx = -1
    this.column = Math.floor(this.el.offsetWidth / this.options.elementSize)
    this.row = 0
  }

  removeElement () {
    console.log(this.el.children)
  }

  appendElement (el, id) {
    let elementSize = this.options.elementSize
    let idx = ++this.lastIdx

    let maskEl = document.createElement('div')
    maskEl.style.position = 'absolute'
    maskEl.style.display = 'inline-block'
    maskEl.style.boxSizing = 'border-box'
    maskEl.style.top = '5px'
    maskEl.style.left = '5px'
    maskEl.style.height = elementSize - 5 * 2 + 'px'
    maskEl.style.width = elementSize - 5 * 2 + 'px'
    maskEl.style.padding = '5px'
    maskEl.style.backgroundColor = 'rgba(0,0,0,.5)'

    let divEl = document.createElement('div')
    divEl.appendChild(el)
    // divEl.appendChild(maskEl)
    divEl.style.position = 'absolute'
    divEl.style.display = 'inline-block'
    divEl.style.boxSizing = 'border-box'
    divEl.style.overflow = 'hidden'
    divEl.style.width = divEl.style.height = elementSize + 'px'
    divEl.style.padding = '5px'
    divEl.style.transition = 'all 1s'
    divEl.dataset.id = id
    let x = (this.slots.length % this.column) * elementSize
    let y = (this.slots.length % this.column === 0 ? this.row++ : this.row - 1) * elementSize

    this.el.appendChild(divEl)

    let element = new Dragable(divEl, this.options)
    element.idx = idx
    element.x = x
    element.y = y
    element.moveEvent = this._moveEventHandle.bind(this)
    element.endEvent = this._endEventHandle.bind(this)

    this.slots.push({
      x: element.x,
      y: element.y,
      el: element
    })

    this.row = Math.ceil(this.slots.length / this.column)
    this.el.style.height = this.row * elementSize + 'px'
  }

  _moveEventHandle(source) {
    if (typeof this.options.moveEvent === 'function') {
      this.options.moveEvent()
    }

    let idx = this._judge(source.x, source.y)
    if (idx !== source.idx) {
      if (idx < source.idx) {
        for (let i = source.idx; i > idx; i--) {
          let current = this.slots[i]
          let last = this.slots[i - 1]
          last.el.x = current.x
          last.el.y = current.y
          last.el.idx = i
          current.el = last.el
        }
      } else {
        for (let i = source.idx; i < idx; i++) {
          let current = this.slots[i]
          let next = this.slots[i + 1]
          next.el.x = current.x
          next.el.y = current.y
          next.el.idx = i
          current.el = next.el
        }
      }

      source.idx = idx
      this.slots[idx].el = source
    }
  }

  _endEventHandle (source) {
    source.endX = this.slots[source.idx].x
    source.endY = this.slots[source.idx].y
  }

  _judge (x, y) {
    let elementSize = this.options.elementSize
    let extra = 0.5 * elementSize
    let minX = - extra
    let maxX = this.slots.length < this.column ?
      (this.slots.length - 1) * elementSize + extra :
      (this.column - 1) * elementSize + extra
    let minY = - extra
    let maxY = this.row >= 2 ?
      maxY = (this.row - 2) * elementSize + extra :
      (this.row - 1) * elementSize + extra

    if (x < minX && y < minY) {
      return 0
    } else if (x < minX && y > maxY) {
      return (this.row - 1) * this.column
    } else if (x > maxX && y < minY) {
      if (this.slots.length >= this.column) {
        return this.column - 1
      } else {
        return this.slots.length - 1
      }
    } else if (x > maxX && y > maxY) {
      if (this.slots.length <= this.column) {
        return this.slots.length - 1
      }
      let idx = this.row * this.column - 1
      if (idx >= this.slots.length) {
        return idx - this.column
      } else {
        return idx
      }
    } else if (x > maxX) {
      for (let i = this.column - 1; i < this.slots.length; i += this.column) {
        let slot = this.slots[i]
        if (y >= slot.y - extra && y < slot.y + extra) {
          return i
        }
      }
      return this.slots.length - 1
    } else if (x < minX) {
      for (let i = 0; i < this.slots.length; i += this.column) {
        let slot = this.slots[i]
        if (y >= slot.y - extra && y < slot.y + extra) {
          return i
        }
      }
      return 0
    } else if (y < minY) {
      let end = this.slots.length >= this.column ? this.column : this.slots.length
      for (let i = 0; i < end; i++) {
        if (x >= this.slots[i].x - extra && x < this.slots[i].x + extra) {
          return i
        }
      }
    } else if (y > maxY) {
      let start = (this.row - 1) * this.column
      let end = this.slots.length > this.column ? this.row * this.column : this.slots.length
      for (let i = start; i < end; i++) {
        let slot = this.slots[i] ? this.slots[i] : this.slots[i - this.column]
        let result = this.slots[i] ? i : i - this.column
        if (x >= slot.x - extra && x < slot.x + extra) {
          return result
        }
      }
    }
    for (let i = 0, len = this.slots.length; i < len; i++) {
      let slot = this.slots[i]
      if (x > slot.x - extra && x < slot.x + extra && y > slot.y - extra && y < slot.y + extra) {
        return i
      }
    }
  }
}
