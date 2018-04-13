export function compressMixin (ImageUpload) {
  ImageUpload.prototype._compress = function (dataUrl) {
    return new Promise ((resolve, reject) => {
      if (!this._canvas) {
        this._canvas = document.createElement('canvas')
        this._context = this._canvas.getContext('2d')
      }

      let image = new Image()

      image.onload = () => {
        let width = image.naturalWidth
        let height = image.naturalHeight

        this._canvas.width = width
        this._canvas.height = height

        this._context.clearRect(0, 0 , width, height)
        this._context.drawImage(image, 0, 0, width, height)

        resolve(this._canvas.toDataURL('image/jpeg', 0.3))
      }

      image.onerror = (error) => {
        reject(error)
      }

      image.src = dataUrl
    })
  }
}
