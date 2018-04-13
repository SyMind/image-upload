export default class Element {
  constructor(el) {
    this.el = el

    this.endX = null
    this.endY = null

    this.moveEvent = null
    this.endEvent = null

    let isTransition = false
    Object.defineProperty(this, 'isTransition', {
      get() {
        return isTransition
      },
      set(value) {
        isTransition = value
        let pointerEvents = isTransition ? 'none' : 'auto'
        this.el.style.pointerEvents = pointerEvents
      }
    })

    this._x = 0
    this._y = 0

    Object.defineProperty(this, 'x', {
      get () {
        // return this.el.offsetLeft
        return this._x
      },
      set (value) {
        // this.el.style.left = value + 'px'
        this._x = value
        this.el.style.transform = `translate3d(${this._x}px, ${this._y}px, 0)`
      }
    })

    Object.defineProperty(this, 'y', {
      get () {
        // return this.el.offsetTop
        return this._y
      },
      set (value) {
        // this.el.style.top = value + 'px'
        this._y = value
        this.el.style.transform = `translate3d(${this._x}px, ${this._y}px, 0)`
      }
    })

    el.addEventListener('touchstart', this)
    el.addEventListener('touchmove', this)
    el.addEventListener('touchend', this)
    el.addEventListener('transitionEnd', this)
    el.addEventListener('webkitTransitionEnd', this)
    el.addEventListener('oTransitionEnd', this)
    el.addEventListener('MSTransitionEnd', this)
  }

  handleEvent (e) {
    switch (e.type) {
      case 'touchstart':
        this._start(e)
        break
      case 'touchmove':
        this._move(e)
        break
      case 'touchend':
        this._end(e)
        break
      case 'transitionEnd':
      case 'webkitTransitionEnd':
      case 'oTransitionEnd':
      case 'MSTransitionEnd':
        this._transitionEnd(e)
        break
    }
  }

  moveTo (x, y) {
    this.el.style.transitionDuration = '500ms'

    this.x = x
    this.y = y
  }

  _start (event) {
    this.el.style.zIndex = 2

    let touch = event.touches[0]
    this.startX = parseInt(this.el.offsetLeft)
    this.startY = parseInt(this.el.offsetTop)
    this._pageX = touch.pageX
    this._pageY = touch.pageY
  }

  _move(event) {
    this.el.style.transitionDuration = '0ms'

    let touch = event.touches[0]
    let deltaX = touch.pageX - this._pageX
    let deltaY = touch.pageY - this._pageY
    this.x = this.startX + deltaX
    this.y = this.startY + deltaY

    if (this.moveEvent) this.moveEvent(this)
  }

  _end(event) {
    if (this.endEvent) this.endEvent(this)

    this.isTransition = true
    this.el.style.transitionDuration = '500ms'

    if (this.endX !== null) this.x = this.endX
    else this.x = this.startX
    if (this.endY !== null) this.y = this.endY
    else this.y = this.startY

    this.endX = null
    this.endY = null
  }

  _transitionEnd(event) {
    this.isTransition = false
  }
}
