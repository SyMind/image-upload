import { initMixin } from './init'
import { coreMixin } from './core'

export default class Element {
  constructor(el, options) {
    this.el = el
    this.options = options

    this._init()
  }
}

initMixin(Element)
coreMixin(Element)
