import {
  hasTransition,
  hasTransform
} from '../util/dom'

import Wrapper from './wrapper'
import { extend } from '../util/lang'

const DEFAULT_OPTIONS = {
  elementSize: 78,
  elementPadding: 5,
  useTransform: true
}

export function initMixin (ImageUpload) {
  ImageUpload.prototype._init = function (options) {
    this._handleOptions(options)
    this._initDOM()
  }

  ImageUpload.prototype._handleOptions = function (options) {
    this.options = extend({}, DEFAULT_OPTIONS, options)

    this.translateZ = this.options.HWCompositing ? ' translateZ(0)' : ''

    this.options.useTransition = this.options.useTransition && hasTransition
    this.options.useTransform = this.options.useTransform && hasTransform
  }

  ImageUpload.prototype._initDOM = function () {
    let labelEl = this.labelEl = document.createElement('label')
    labelEl.style.display = 'inline-block'
    labelEl.style.boxSizing = 'border-box'
    labelEl.style.position = 'absolute'
    labelEl.style.width = labelEl.style.height = this.options.elementSize + 'px'
    labelEl.style.padding = this.options.elementPadding + 'px'
    labelEl.setAttribute('for', 'imageUploadInputEl')

    let recEl = document.createElement('div')
    let hEl = document.createElement('div')
    let vEl = document.createElement('div')
    recEl.style.boxSizing = 'border-box'
    recEl.style.height = '100%'
    recEl.style.width = '100%'
    recEl.style.border = '1px solid #aaa'
    hEl.style.display = vEl.style.display = 'inline-block'
    hEl.style.boxSizing = vEl.style.boxSizing = 'border-box'
    hEl.style.position = vEl.style.position = 'absolute'
    hEl.style.width = vEl.style.height = '60%'
    hEl.style.height = vEl.style.width = '2px'
    hEl.style.left = vEl.style.top = '20%'
    hEl.style.top = vEl.style.left = '50%'
    hEl.style.backgroundColor = vEl.style.backgroundColor = '#aaa'
    recEl.appendChild(hEl)
    recEl.appendChild(vEl)
    labelEl.appendChild(recEl)

    let inputEl = document.createElement('input')
    inputEl.id = 'imageUploadInputEl'
    inputEl.style.display = 'none'
    inputEl.type = 'file'

    let wrapperEl = document.createElement('div')
    wrapperEl.style.position = 'relative'
    wrapperEl.style.width = '100%'

    this.el.appendChild(wrapperEl)
    this.el.appendChild(labelEl)
    this.el.appendChild(inputEl)

    this.wrapper = new Wrapper(wrapperEl, this.options)

    this.el.style.position = 'relative'
    this.el.style.minHeight = this.wrapper.elementSize + 'px'

    inputEl.addEventListener('change', this)
  }

  ImageUpload.prototype.handleEvent = function (event) {
    switch (event.type) {
      case 'change':
        this._change(event)
        break
    }
  }
}
