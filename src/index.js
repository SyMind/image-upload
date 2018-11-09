// import 'babel-polyfill';

import Draggable from './Draggable/index'
import { initMixin } from './imageUpload/init'
import { eventMixin } from './imageUpload/event'
import { compressMixin } from './imageUpload/compress'
import { warn } from './utils/debug'

export default class ImageUpload {
  constructor (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    if (!this.el) {
      warn('Can not resolve the DOM.')
    }

    this._init(options)
  }

  _compress (dataUrl, callback) {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas')
      this.context = this.canvas.getContext('2d')
    }

    let image = new Image()
    image.src = dataUrl
    image.onload = () => {
      this.canvas.width = image.naturalWidth
      this.canvas.height = image.naturalHeight
      this.context.clearRect(0, 0 , image.naturalWidth, image.naturalHeight)
      this.context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight)
      callback(this.canvas.toDataURL('image/jpeg', 0.8))
    }
  }

  _send (content) {
    let xhr = new XMLHttpRequest()
    let fd = new FormData()

    if (Array.isArray(content)) {
      content.forEach((file) => {
        fd.append('file', file)
      })
    } else {
      fd.append('file', content)
    }

    xhr.open('POST', this.url, true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        alert(xhr.responseText)
      }
    }

    xhr.send(fd)
  }
}

initMixin(ImageUpload)
eventMixin(ImageUpload)
compressMixin(ImageUpload)

ImageUpload.Draggable = Draggable
