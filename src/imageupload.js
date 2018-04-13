import Wrapper from './wrapper'

export default class ImageUpload {
  constructor (el, options) {
    this.el = el
    this.options = Object.assign({
      size: '78px',
      padding: '5px'
    }, options)
  }

  init () {
    let labelEl = this.labelEl = document.createElement('label')
    labelEl.style.display = 'inline-block'
    labelEl.style.boxSizing = 'border-box'
    labelEl.style.position = 'absolute'
    labelEl.style.height = this.options.size
    labelEl.style.width = this.options.size
    labelEl.style.padding = this.options.padding
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

    this.wrapper = new Wrapper(wrapperEl)

    this.el.style.position = 'relative'
    this.el.style.minHeight = this.wrapper.elementSize + 'px'

    inputEl.addEventListener('change', this)
  }

  handleEvent (event) {
    switch (event.type) {
      case 'change':
        this._change(event)
        break
    }
  }

  _change (event) {
    let file = event.srcElement.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      this._compress(event.target.result, (dataUrl) => {
        let divEl = document.createElement('div')
        divEl.style.height = '100%'
        divEl.style.backgroundImage = `url(${dataUrl})`
        divEl.style.backgroundRepeat = 'no-repeat'
        divEl.style.backgroundSize = 'cover'
        divEl.style.backgroundPosition = 'center'
        this.wrapper.appendElement(divEl)
        this._adjust()
      })
    }
  }

  _adjust () {
    let last = this.wrapper.slots.length % this.wrapper.column
    if (last === 0) {

    } else {
      this.labelEl.style.top = (this.wrapper.row - 1) * this.wrapper.elementSize + 'px'
      this.labelEl.style.left = last * this.wrapper.elementSize + 'px'
    }
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
