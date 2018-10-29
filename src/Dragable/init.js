import { style } from '../utils/dom'
import { extend } from '../utils/lang'

const DEFAULT_OPTIONS = {
  dragDelay: 200,
  transitionDuration: 300,
}

export function initMixin (Element) {
  Element.prototype._init = function (options) {
    this.endX = null
    this.endY = null

    this.moveEvent = null
    this.endEvent = null

    this.options = extend({}, DEFAULT_OPTIONS, options)
    this._watchTransition()
    this._observeDOMEvents()
  }

  Element.prototype._watchTransition = function () {
    let isInTransition = false
    let x = 0
    let y = 0
    let scaleX = 1
    let scaleY = 1

    Object.defineProperty(this, 'isInTransition', {
      get () {
        return isInTransition
      },
      set (value) {
        isInTransition = value
        let pointerEvents = isInTransition ? 'none' : 'auto'
        this.el.style.pointerEvents = pointerEvents
      }
    })

    Object.defineProperty(this, 'x', {
      get () {
        return x
      },
      set (value) {
        x = value
        this.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scaleX}, ${scaleY})`
      }
    })

    Object.defineProperty(this, 'y', {
      get () {
        return y
      },
      set (value) {
        y = value
        this.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scaleX}, ${scaleY})`
      }
    })

    Object.defineProperty(this, 'scaleX', {
      get () {
        return scaleX
      },
      set (value) {
        scaleX = value
        this.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scaleX}, ${scaleY})`
      }
    })

    Object.defineProperty(this, 'scaleY', {
      get () {
        return scaleY
      },
      set (value) {
        scaleY = value
        this.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scaleX}, ${scaleY})`
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

    this.el.addEventListener('dragstart', this)
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
      case 'dragstart':
        event.preventDefault()
        break
    }
  }
}
