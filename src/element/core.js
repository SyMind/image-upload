import {
  eventType,
  TOUCH_EVENT
} from '../util/dom'

export function coreMixin (Element) {
  Element.prototype.moveTo = function (x, y) {
    this.el.style.transitionDuration = this.options.transitionDuration + 'ms'
    this.x = x
    this.y = y
  }

  Element.prototype._start = function (event) {
    let _eventType = eventType[event.type]
    if (_eventType !== TOUCH_EVENT && event.button !== 0) {
      return
    }
    this.initiated = _eventType
    console.log(event.type)

    this.el.style.transitionDuration = '0ms'
    this.el.style.zIndex = 2

    let touch = event.touches ? event.touches[0] : event
    this.startX = parseInt(this.el.offsetLeft)
    this.startY = parseInt(this.el.offsetTop)
    this._pageX = touch.pageX
    this._pageY = touch.pageY
  }

  Element.prototype._move = function (event) {
    if (eventType[event.type] !== this.initiated) {
      return
    }
    console.log(event.type)

    let touch = event.touches ? event.touches[0] : event
    let deltaX = touch.pageX - this._pageX
    let deltaY = touch.pageY - this._pageY
    this.x = this.startX + deltaX
    this.y = this.startY + deltaY

    if (this.moveEvent) this.moveEvent(this)
  }

  Element.prototype._end = function (event) {
    if (eventType[event.type] !== this.initiated) {
      return
    }
    console.log(event.type)
    this.initiated = false

    if (this.endEvent) this.endEvent(this)

    this.isInTransition = true
    this.el.style.transitionDuration = this.options.transitionDuration + 'ms'

    if (this.endX !== null) this.x = this.endX
    else this.x = this.startX
    if (this.endY !== null) this.y = this.endY
    else this.y = this.startY

    this.endX = null
    this.endY = null
  }

  Element.prototype._transitionEnd = function (event) {
    console.log(event.type)
    this.isInTransition = false
  }
}
