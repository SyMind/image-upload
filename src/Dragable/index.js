import { initMixin } from './init'
import { coreMixin } from './core'

export default class Dragable {
  constructor(el, options) {
    this.el = el
    this.options = options

    this._init()
  }
}

initMixin(Dragable)
coreMixin(Dragable)
