const DEFAULT_OPTIONS = {
  size: 78,
  padding: 5,
  useTransform: true
}

export function initMixin (ImageUpload) {
  ImageUpload.prototype._init = (el, options) => {
    this._handleOptions(options)
  }

  ImageUpload.prototype._handleOptions = (options) => {
    this.options = extend
  }
}
