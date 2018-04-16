import { style } from '../util/dom'

export function initMixin (Element) {
  Element.prototype._init = function () {
    this.endX = null
    this.endY = null

    this.moveEvent = null
    this.endEvent = null

    this._watchTransition()
    this._watchCoordinate()
    this._observeDOMEvents()
  }

  Element.prototype._watchTransition = function () {
    let isInTransition = false
    Object.defineProperty(this, 'isInTransition', {
      get() {
        return isInTransition
      },
      set(value) {
        isInTransition = value
        let pointerEvents = isInTransition ? 'none' : 'auto'
        this.el.style.pointerEvents = pointerEvents
      }
    })
  }

  Element.prototype._watchCoordinate = function () {
    this._x = 0
    this._y = 0

    Object.defineProperty(this, 'x', {
      get () {
        return this._x
      },
      set (value) {
        this._x = value
        this.el.style.transform = `translate3d(${this._x}px, ${this._y}px, 0)`
      }
    })

    Object.defineProperty(this, 'y', {
      get () {
        return this._y
      },
      set (value) {
        this._y = value
        this.el.style.transform = `translate3d(${this._x}px, ${this._y}px, 0)`
      }
    })
  }

  Element.prototype._observeDOMEvents = function () {
    this.el.addEventListener('touchstart', this)
    this.el.addEventListener('mousedown', this)

    this.el.addEventListener('touchmove', this)
    this.el.addEventListener('mousemove', this)

    this.el.addEventListener('touchend', this)
    this.el.addEventListener('mouseup', this)
    this.el.addEventListener('touchcancel', this)
    this.el.addEventListener('mousecancel', this)
    this.el.addEventListener('mouseout', this)

    this.el.addEventListener(style.transitionEnd, this)
  }

  Element.prototype.handleEvent = function (event) {
    switch (event.type) {
      case 'touchstart':
      case 'mousedown':
        this._start(event)
        break
      case 'touchmove':
      case 'mousemove':
        this._move(event)
        break
      case 'touchend':
      case 'mouseup':
      case 'touchcancel':
      case 'mousecancel':
      case 'mouseout':
        this._end(event)
        break
      case 'transitionEnd':
      case 'webkitTransitionEnd':
      case 'oTransitionEnd':
      case 'MSTransitionEnd':
        this._transitionEnd(event)
        break
    }
  }
}
