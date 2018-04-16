(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.ImageUpload = factory());
}(this, (function () { 'use strict';

  var elementStyle = document.createElement('div').style;

  var vendor = function () {
    var transformNames = {
      webkit: 'webkitTransform',
      Moz: 'MozTransform',
      O: 'OTransform',
      ms: 'msTransform',
      standard: 'transform'
    };

    for (var key in transformNames) {
      if (elementStyle[transformNames[key]] !== undefined) {
        return key;
      }
    }

    return false;
  }();

  function prefixStyle(style) {
    if (vendor === false) {
      return false;
    }

    if (vendor === 'standard') {
      if (style === 'transitionEnd') {
        return 'transitionend';
      }
      return style;
    }

    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
  }

  var transform = prefixStyle('transform');

  var hasTransform = transform !== false;
  var hasTransition = prefixStyle('transition') in elementStyle;

  var style = {
    transform: transform,
    transitionTimingFunction: prefixStyle('transitionTimingFunction'),
    transitionDuration: prefixStyle('transitionDuration'),
    transitionProperty: prefixStyle('transitionProperty'),
    transitionDelay: prefixStyle('transitionDelay'),
    transformOrigin: prefixStyle('transformOrigin'),
    transitionEnd: prefixStyle('transitionEnd')
  };

  var TOUCH_EVENT = 1;
  var MOUSE_EVENT = 2;

  var eventType = {
    touchstart: TOUCH_EVENT,
    touchmove: TOUCH_EVENT,
    touchend: TOUCH_EVENT,

    mousedown: MOUSE_EVENT,
    mousemove: MOUSE_EVENT,
    mouseup: MOUSE_EVENT,
    mouseout: MOUSE_EVENT
  };

  function initMixin(Element) {
    Element.prototype._init = function () {
      this.endX = null;
      this.endY = null;

      this.moveEvent = null;
      this.endEvent = null;

      this._watchTransition();
      this._watchCoordinate();
      this._observeDOMEvents();
    };

    Element.prototype._watchTransition = function () {
      var isInTransition = false;
      Object.defineProperty(this, 'isInTransition', {
        get: function get() {
          return isInTransition;
        },
        set: function set(value) {
          isInTransition = value;
          var pointerEvents = isInTransition ? 'none' : 'auto';
          this.el.style.pointerEvents = pointerEvents;
        }
      });
    };

    Element.prototype._watchCoordinate = function () {
      this._x = 0;
      this._y = 0;

      Object.defineProperty(this, 'x', {
        get: function get() {
          return this._x;
        },
        set: function set(value) {
          this._x = value;
          this.el.style.transform = 'translate3d(' + this._x + 'px, ' + this._y + 'px, 0)';
        }
      });

      Object.defineProperty(this, 'y', {
        get: function get() {
          return this._y;
        },
        set: function set(value) {
          this._y = value;
          this.el.style.transform = 'translate3d(' + this._x + 'px, ' + this._y + 'px, 0)';
        }
      });
    };

    Element.prototype._observeDOMEvents = function () {
      this.el.addEventListener('touchstart', this);
      this.el.addEventListener('mousedown', this);

      this.el.addEventListener('touchmove', this);
      this.el.addEventListener('mousemove', this);

      this.el.addEventListener('touchend', this);
      this.el.addEventListener('mouseup', this);
      this.el.addEventListener('touchcancel', this);
      this.el.addEventListener('mousecancel', this);
      this.el.addEventListener('mouseout', this);

      this.el.addEventListener(style.transitionEnd, this);
    };

    Element.prototype.handleEvent = function (event) {
      switch (event.type) {
        case 'touchstart':
        case 'mousedown':
          this._start(event);
          break;
        case 'touchmove':
        case 'mousemove':
          this._move(event);
          break;
        case 'touchend':
        case 'mouseup':
        case 'touchcancel':
        case 'mousecancel':
        case 'mouseout':
          this._end(event);
          break;
        case 'transitionEnd':
        case 'webkitTransitionEnd':
        case 'oTransitionEnd':
        case 'MSTransitionEnd':
          this._transitionEnd(event);
          break;
      }
    };
  }

  function coreMixin(Element) {
    Element.prototype.moveTo = function (x, y) {
      this.el.style.transitionDuration = this.options.transitionDuration + 'ms';
      this.x = x;
      this.y = y;
    };

    Element.prototype._start = function (event) {
      var _eventType = eventType[event.type];
      if (_eventType !== TOUCH_EVENT && event.button !== 0) {
        return;
      }
      this.initiated = _eventType;
      console.log(event.type);

      this.el.style.transitionDuration = '0ms';
      this.el.style.zIndex = 2;

      var touch = event.touches ? event.touches[0] : event;
      this.startX = parseInt(this.el.offsetLeft);
      this.startY = parseInt(this.el.offsetTop);
      this._pageX = touch.pageX;
      this._pageY = touch.pageY;
    };

    Element.prototype._move = function (event) {
      if (eventType[event.type] !== this.initiated) {
        return;
      }
      console.log(event.type);

      var touch = event.touches ? event.touches[0] : event;
      var deltaX = touch.pageX - this._pageX;
      var deltaY = touch.pageY - this._pageY;
      this.x = this.startX + deltaX;
      this.y = this.startY + deltaY;

      if (this.moveEvent) this.moveEvent(this);
    };

    Element.prototype._end = function (event) {
      if (eventType[event.type] !== this.initiated) {
        return;
      }
      console.log(event.type);
      this.initiated = false;

      if (this.endEvent) this.endEvent(this);

      this.isInTransition = true;
      this.el.style.transitionDuration = this.options.transitionDuration + 'ms';

      if (this.endX !== null) this.x = this.endX;else this.x = this.startX;
      if (this.endY !== null) this.y = this.endY;else this.y = this.startY;

      this.endX = null;
      this.endY = null;
    };

    Element.prototype._transitionEnd = function (event) {
      console.log(event.type);
      this.isInTransition = false;
    };
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Element = function Element(el, options) {
    classCallCheck(this, Element);

    this.el = el;
    this.options = options;

    this._init();
  };


  initMixin(Element);
  coreMixin(Element);

  var Wrapper = function () {
    function Wrapper(el, options) {
      classCallCheck(this, Wrapper);

      this.el = el;
      this.options = options;
      this.slots = [];
      this.lastIdx = -1;
      this.elementSize = 78;
      this.column = Math.floor(this.el.offsetWidth / this.elementSize);
      this.row = 0;
    }

    createClass(Wrapper, [{
      key: 'appendElement',
      value: function appendElement(el) {
        var idx = ++this.lastIdx;

        var divEl = document.createElement('div');
        divEl.appendChild(el);
        divEl.style.position = 'absolute';
        divEl.style.display = 'inline-block';
        divEl.style.boxSizing = 'border-box';
        divEl.style.overflow = 'hidden';
        divEl.style.width = divEl.style.height = this.options.elementSize + 'px';
        divEl.style.padding = '5px';
        divEl.style.transition = 'all 1s';
        var x = this.slots.length % this.column * this.elementSize;
        var y = (this.slots.length % this.column === 0 ? this.row++ : this.row - 1) * this.elementSize;

        this.el.appendChild(divEl);

        var element = new Element(divEl, this.options);
        element.idx = idx;
        element.x = x;
        element.y = y;
        element.moveEvent = this._moveEventHandle.bind(this);
        element.endEvent = this._endEventHandle.bind(this);

        this.slots.push({
          x: element.x,
          y: element.y,
          el: element
        });

        this.row = Math.ceil(this.slots.length / this.column);
        this.el.style.height = this.row * this.elementSize + 'px';
      }
    }, {
      key: '_moveEventHandle',
      value: function _moveEventHandle(source) {
        var idx = this._judge(source.x, source.y);
        if (typeof idx === 'number' && idx !== source.idx) {
          if (idx < source.idx) {
            for (var i = source.idx; i > idx; i--) {
              var current = this.slots[i];
              var last = this.slots[i - 1];
              last.el.x = current.x;
              last.el.y = current.y;
              last.el.idx = current.el.idx;
              current.el = last.el;
            }
          } else {
            for (var _i = source.idx; _i < idx; _i++) {
              var _current = this.slots[_i];
              var next = this.slots[_i + 1];
              next.el.x = _current.x;
              next.el.y = _current.y;
              next.el.idx = _current.el.idx;
              _current.el = next.el;
            }
          }

          source.idx = idx;
          this.slots[idx].el = source;
        }
      }
    }, {
      key: '_endEventHandle',
      value: function _endEventHandle(source) {
        source.endX = this.slots[source.idx].x;
        source.endY = this.slots[source.idx].y;
      }
    }, {
      key: '_judge',
      value: function _judge(x, y) {
        var extra = 0.5 * this.elementSize;
        var minX = -extra;
        var maxX = (this.column - 1) * this.elementSize + extra;
        var minY = -extra;
        var maxY = (this.row - 1) * this.elementSize + extra;
        if (this.row >= 2) {
          maxY = (this.row - 2) * this.elementSize + extra;
        }

        if (x < minX && y < minY) {
          return 0;
        } else if (x > maxX && y < minY) {
          if (this.slots.length >= this.column) {
            return this.column - 1;
          } else {
            return this.slots.length - 1;
          }
        } else if (x < minX && y > maxY) {
          return (this.row - 1) * this.column;
        } else if (x > maxX && y > maxY) {
          if (this.slots.length <= this.column) {
            return this.slots.length - 1;
          }
          var idx = this.row * this.column - 1;
          if (idx >= this.slots.length) {
            return idx - this.column;
          } else {
            return idx;
          }
        } else if (y < minY) {
          var end = this.slots.length >= this.column ? this.column : this.slots.length;
          for (var i = 0; i < end; i++) {
            if (x >= this.slots[i].x - extra && x < this.slots[i].x + extra) {
              return i;
            }
          }
        } else if (y > maxY) {
          var start = (this.row - 1) * this.column;
          var _end = this.slots.length > this.column ? this.row * this.column : this.slots.length;
          for (var _i2 = start; _i2 < _end; _i2++) {
            var slot = this.slots[_i2] ? this.slots[_i2] : this.slots[_i2 - this.column];
            var result = this.slots[_i2] ? _i2 : _i2 - this.column;
            if (x >= slot.x - extra && x < slot.x + extra) {
              return result;
            }
          }
        }
        for (var _i3 = 0, len = this.slots.length; _i3 < len; _i3++) {
          var _slot = this.slots[_i3];
          if (x > _slot.x - extra && x < _slot.x + extra && y > _slot.y - extra && y < _slot.y + extra) {
            return _i3;
          }
        }
      }
    }]);
    return Wrapper;
  }();

  function extend(target) {
    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < rest.length; i++) {
      var source = rest[i];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target;
  }

  var DEFAULT_OPTIONS = {
    elementSize: 78,
    elementPadding: 5,
    transitionDuration: 200,
    useTransform: true,
    api: '/api/upload'
  };

  function initMixin$1(ImageUpload) {
    ImageUpload.prototype._init = function (options) {
      this._handleOptions(options);
      this._initDOM();
    };

    ImageUpload.prototype._handleOptions = function (options) {
      this.options = extend({}, DEFAULT_OPTIONS, options);

      this.translateZ = this.options.HWCompositing ? ' translateZ(0)' : '';

      this.options.useTransition = this.options.useTransition && hasTransition;
      this.options.useTransform = this.options.useTransform && hasTransform;
    };

    ImageUpload.prototype._initDOM = function () {
      var labelEl = this.labelEl = document.createElement('label');
      labelEl.style.display = 'inline-block';
      labelEl.style.boxSizing = 'border-box';
      labelEl.style.position = 'absolute';
      labelEl.style.width = labelEl.style.height = this.options.elementSize + 'px';
      labelEl.style.padding = this.options.elementPadding + 'px';
      labelEl.setAttribute('for', 'imageUploadInputEl');

      var recEl = document.createElement('div');
      var hEl = document.createElement('div');
      var vEl = document.createElement('div');
      recEl.style.boxSizing = 'border-box';
      recEl.style.height = '100%';
      recEl.style.width = '100%';
      recEl.style.border = '1px solid #aaa';
      hEl.style.display = vEl.style.display = 'inline-block';
      hEl.style.boxSizing = vEl.style.boxSizing = 'border-box';
      hEl.style.position = vEl.style.position = 'absolute';
      hEl.style.width = vEl.style.height = '60%';
      hEl.style.height = vEl.style.width = '2px';
      hEl.style.left = vEl.style.top = '20%';
      hEl.style.top = vEl.style.left = '50%';
      hEl.style.backgroundColor = vEl.style.backgroundColor = '#aaa';
      recEl.appendChild(hEl);
      recEl.appendChild(vEl);
      labelEl.appendChild(recEl);

      var inputEl = document.createElement('input');
      inputEl.id = 'imageUploadInputEl';
      inputEl.style.display = 'none';
      inputEl.type = 'file';

      var wrapperEl = document.createElement('div');
      wrapperEl.style.position = 'relative';
      wrapperEl.style.width = '100%';

      this.el.appendChild(wrapperEl);
      this.el.appendChild(labelEl);
      this.el.appendChild(inputEl);

      this.wrapper = new Wrapper(wrapperEl, this.options);

      this.el.style.position = 'relative';
      this.el.style.minHeight = this.wrapper.elementSize + 'px';

      inputEl.addEventListener('change', this);
    };

    ImageUpload.prototype.handleEvent = function (event) {
      switch (event.type) {
        case 'change':
          this._change(event);
          break;
      }
    };
  }

  function eventMixin(ImageUpload) {
    ImageUpload.prototype._change = function (event) {
      var _this = this;

      var file = event.srcElement.files[0];

      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (event) {
        _this._compress(event.target.result).then(function (dataUrl) {
          var divEl = document.createElement('div');
          divEl.style.height = '100%';
          divEl.style.backgroundImage = 'url(' + dataUrl + ')';
          divEl.style.backgroundRepeat = 'no-repeat';
          divEl.style.backgroundSize = 'cover';
          divEl.style.backgroundPosition = 'center';
          _this.wrapper.appendElement(divEl);

          _this._adjust();
        }).catch(function (error) {
          console.log(error);
          alert('失败了');
        });

        _this._adjust();
      };
    };

    ImageUpload.prototype._adjust = function () {
      var last = this.wrapper.slots.length % this.wrapper.column;
      if (last === 0) {} else {
        var elementSize = this.options.elementSize;
        this.labelEl.style.top = (this.wrapper.row - 1) * elementSize + 'px';
        this.labelEl.style.left = last * elementSize + 'px';
      }
    };
  }

  function compressMixin(ImageUpload) {
    ImageUpload.prototype._compress = function (dataUrl) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (!_this._canvas) {
          _this._canvas = document.createElement('canvas');
          _this._context = _this._canvas.getContext('2d');
        }

        var image = new Image();

        image.onload = function () {
          var width = image.naturalWidth;
          var height = image.naturalHeight;

          _this._canvas.width = width;
          _this._canvas.height = height;

          _this._context.clearRect(0, 0, width, height);
          _this._context.drawImage(image, 0, 0, width, height);

          resolve(_this._canvas.toDataURL('image/jpeg', 0.3));
        };

        image.onerror = function (error) {
          reject(error);
        };

        image.src = dataUrl;
      });
    };
  }

  function warn(msg) {
    console.error("[ImageUpload warn]: " + msg);
  }

  var ImageUpload = function () {
    function ImageUpload(el, options) {
      classCallCheck(this, ImageUpload);

      this.el = typeof el === 'string' ? document.querySelector(el) : el;
      if (!this.el) {
        warn('Can not resolve the DOM.');
      }

      this._init(options);
    }

    createClass(ImageUpload, [{
      key: '_compress',
      value: function _compress(dataUrl, callback) {
        var _this = this;

        if (!this.canvas) {
          this.canvas = document.createElement('canvas');
          this.context = this.canvas.getContext('2d');
        }

        var image = new Image();
        image.src = dataUrl;
        image.onload = function () {
          _this.canvas.width = image.naturalWidth;
          _this.canvas.height = image.naturalHeight;
          _this.context.clearRect(0, 0, image.naturalWidth, image.naturalHeight);
          _this.context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
          callback(_this.canvas.toDataURL('image/jpeg', 0.8));
        };
      }
    }, {
      key: '_send',
      value: function _send(content) {
        var xhr = new XMLHttpRequest();
        var fd = new FormData();

        if (Array.isArray(content)) {
          content.forEach(function (file) {
            fd.append('file', file);
          });
        } else {
          fd.append('file', content);
        }

        xhr.open('POST', this.url, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            alert(xhr.responseText);
          }
        };

        xhr.send(fd);
      }
    }]);
    return ImageUpload;
  }();


  initMixin$1(ImageUpload);
  eventMixin(ImageUpload);
  compressMixin(ImageUpload);

  return ImageUpload;

})));
