import {
  eventType,
  TOUCH_EVENT
} from '../utils/dom'

export function coreMixin (Draggable) {
  Draggable.prototype.moveTo = function (x, y) {
    this.el.style.transitionDuration = this.options.transitionDuration + 'ms'
    this.x = x
    this.y = y
  }

  Draggable.prototype._start = function (event) {
    if (event.srcElement !== this.el) {
      return
    }

    this.trigger('start')

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

  Draggable.prototype._move = function (event) {
    if (eventType[event.type] !== this.initiated) {
      return
    }

    let touch = event.touches ? event.touches[0] : event
    let deltaX = touch.pageX - this._pageX
    let deltaY = touch.pageY - this._pageY
    this.x = this.startX + deltaX
    this.y = this.startY + deltaY

    this.trigger('move')
  }

  Draggable.prototype._end = function (event) {
    if (eventType[event.type] !== this.initiated) {
      return
    }
    this.initiated = null

    this.isInTransition = true
    this.el.style.transitionDuration = this.options.transitionDuration + 'ms'

    this.x = this.endX !== null ? this.endX : this.startX
    this.y = this.endY !== null ? this.endY : this.startY

    this.endX = null
    this.endY = null
    this.scaleX = 1
    this.scaleY = 1
    this.el.style.zIndex = 1

    this.trigger('end')
  }

  Draggable.prototype._transitionEnd = function (event) {
    this.isInTransition = false
  }
}
