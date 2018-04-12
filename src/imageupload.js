import Wrapper from './wrapper'

export default class ImageUpload {
  constructor (el, options) {
    this.el = el
    this.options = Object.assign({}, options)
  }

  init () {
    let labelEl = document.createElement('label')
    labelEl.style.display = 'inline-block'
    labelEl.style.boxSizing = 'border-box'
    labelEl.style.position = 'relative'
    labelEl.style.verticalAlign = 'top'
    labelEl.style.height = '78px'
    labelEl.style.width = '78px'
    labelEl.style.border = '1px solid #aaa'
    labelEl.setAttribute('for', 'imageUploadInputEl')

    let hEl = document.createElement('div')
    let vEl = document.createElement('div')
    hEl.style.display = vEl.style.display = 'inline-block'
    hEl.style.boxSizing = vEl.style.boxSizing = 'border-box'
    hEl.style.position = vEl.style.position = 'absolute'
    hEl.style.width = vEl.style.height = '60%'
    hEl.style.height = vEl.style.width = '2px'
    hEl.style.left = vEl.style.top = '20%'
    hEl.style.top = vEl.style.left = '50%'
    hEl.style.backgroundColor = vEl.style.backgroundColor = '#aaa'
    labelEl.appendChild(hEl)
    labelEl.appendChild(vEl)

    let inputEl = document.createElement('input')
    inputEl.id = 'imageUploadInputEl'
    inputEl.style.display = 'none'
    inputEl.type = 'file'

    let wrapperEl = document.createElement('div')
    wrapperEl.style.position = 'relative'
    wrapperEl.style.width = '100%'
    wrapperEl.style.backgroundColor = 'green'

    this.el.appendChild(wrapperEl)
    this.el.appendChild(labelEl)
    this.el.appendChild(inputEl)

    this.wrapper = new Wrapper(wrapperEl)
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
        let imageEl = document.createElement('img')
        imageEl.src = dataUrl
        this.wrapper.addElement(imageEl)
      })
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
      this.context.clearRect(0, 0 , this.canvas.width, this.canvas.height)
      this.context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight)
      callback(this.canvas.toDataURL('image/jpeg', 0.8))
    }
  }
}
