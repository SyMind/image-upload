import {
  eventType,
  TOUCH_EVENT
} from '../utils/dom'

export function coreMixin (Element) {
  Element.prototype.moveTo = function (x, y) {
    this.el.style.transitionDuration = this.options.transitionDuration + 'ms'
    this.x = x
    this.y = y
  }

  Element.prototype._start = function (event) {
    event.preventDefault()
    event.stopPropagation()

    clearTimeout(this.timer)
    this.flag = false
    this.timer = setTimeout(() => {
      this.scaleX = 1.1
      this.scaleY = 1.1
      this.flag = true
    }, this.options.dragDelay)

    let _eventType = eventType[event.type]
    if (_eventType !== TOUCH_EVENT && event.button !== 0) {
      return
    }
    this.initiated = _eventType

    this.el.style.transitionDuration = '0ms'
    this.el.style.zIndex = 2

    let touch = event.touches ? event.touches[0] : event
    this.startX = parseInt(this.x)
    this.startY = parseInt(this.y)
    this._pageX = touch.pageX
    this._pageY = touch.pageY
  }

  Element.prototype._move = function (event) {
    event.preventDefault()
    event.stopPropagation()

    if (eventType[event.type] !== this.initiated || !this.flag) {
      return
    }

    let touch = event.touches ? event.touches[0] : event
    let deltaX = touch.pageX - this._pageX
    let deltaY = touch.pageY - this._pageY
    this.x = this.startX + deltaX
    this.y = this.startY + deltaY

    if (this.moveEvent) {
      this.moveEvent(this)
    }
  }

  Element.prototype._end = function (event) {
    event.preventDefault()
    event.stopPropagation()

    clearTimeout(this.timer)

    if (eventType[event.type] !== this.initiated) {
      return
    }
    this.initiated = null

    if (this.endEvent) {
      this.endEvent(this)
    }

    this.isInTransition = true
    this.el.style.transitionDuration = this.options.transitionDuration + 'ms'

    if (this.endX !== null) {
      this.x = this.endX
    } else {
      this.x = this.startX
    }
    if (this.endY !== null) {
      this.y = this.endY
    } else {
      this.y = this.startY
    }

    this.endX = null
    this.endY = null
    this.scaleX = 1
    this.scaleY = 1
    this.el.style.zIndex = 1

    if (this.moveEvent) {
      this.moveEvent(this)
    }
  }

  Element.prototype._transitionEnd = function (event) {
    this.isInTransition = false
  }
}
