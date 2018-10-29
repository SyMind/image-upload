import { initMixin } from './init'
import { coreMixin } from './core'

export default class Draggable {
  constructor(el, options) {
    this.el = el
    this.options = options

    this._init(options)
  }
}

initMixin(Draggable)
coreMixin(Draggable)
