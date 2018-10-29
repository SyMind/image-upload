import { info } from '../utils/debug'

export function eventMixin (ImageUpload) {
  ImageUpload.prototype._change = function (event) {
    let file = event.srcElement.files[0]
    let id = this.store.add(file)

    let reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadstart = function (e) {
      info("开始读取....")
    }
    reader.onprogress = function (e) {
      info("正在读取中....")
    }
    reader.onabort = function (e) {
      info("中断读取....")
    }
    reader.onerror = function (e) {
      info("读取异常....")
    }

    reader.onload = (event) => {
      this._compress(event.target.result).then((dataUrl) => {
        let divEl = document.createElement('div')
        divEl.style.height = '100%'
        divEl.style.backgroundImage = `url(${dataUrl})`
        divEl.style.backgroundRepeat = 'no-repeat'
        divEl.style.backgroundSize = 'cover'
        divEl.style.backgroundPosition = 'center'
        this.wrapper.appendElement(divEl, id)

        this._layout()
        this._send()
      }).catch((error) => {
        console.log(error)
        alert('失败了')
      })
    }
  }

  ImageUpload.prototype._send = function (file) {
    let xhr = new XMLHttpRequest()
  }

  ImageUpload.prototype._layout = function () {
    let last = this.wrapper.slots.length % this.wrapper.column
    let elementSize = this.options.elementSize
    if (last === 0) {
      this.labelEl.style.top = this.wrapper.row * elementSize + 'px'
      this.labelEl.style.left = 0
    } else {
      this.labelEl.style.top = (this.wrapper.row - 1) * elementSize + 'px'
      this.labelEl.style.left = last * elementSize + 'px'
    }
  }
}
