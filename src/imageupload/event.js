export function eventMixin (ImageUpload) {
  ImageUpload.prototype._change = function (event) {
    let file = event.srcElement.files[0]

    let reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (event) => {
      this._compress(event.target.result).then((dataUrl) => {
        let divEl = document.createElement('div')
        divEl.style.height = '100%'
        divEl.style.backgroundImage = `url(${dataUrl})`
        divEl.style.backgroundRepeat = 'no-repeat'
        divEl.style.backgroundSize = 'cover'
        divEl.style.backgroundPosition = 'center'
        this.wrapper.appendElement(divEl)

        this._adjust()
      }).catch((error) => {
        console.log(error)
        alert('失败了')
      })

      this._adjust()
    }
  }

  ImageUpload.prototype._adjust = function () {
    let last = this.wrapper.slots.length % this.wrapper.column
    if (last === 0) {

    } else {
      let elementSize = this.options.elementSize
      this.labelEl.style.top = (this.wrapper.row - 1) * elementSize + 'px'
      this.labelEl.style.left = last * elementSize + 'px'
    }
  }
}
