(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('babel-polyfill')) :
  typeof define === 'function' && define.amd ? define(['babel-polyfill'], factory) :
  (global.ImageUpload = factory());
}(this, (function () { 'use strict';

  var elementStyle = document.body.style;

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
    dragDelay: 200,
    transitionDuration: 300
  };

  function initMixin(Element) {
    Element.prototype._init = function (options) {
      this.endX = null;
      this.endY = null;

      this.moveEvent = null;
      this.endEvent = null;

      this.options = extend({}, DEFAULT_OPTIONS, options);
      this._watchTransition();
      this._observeDOMEvents();
    };

    Element.prototype._watchTransition = function () {
      var isInTransition = false;
      var x = 0;
      var y = 0;
      var scaleX = 1;
      var scaleY = 1;

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

      Object.defineProperty(this, 'x', {
        get: function get() {
          return x;
        },
        set: function set(value) {
          x = value;
          this.el.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scaleX + ', ' + scaleY + ')';
        }
      });

      Object.defineProperty(this, 'y', {
        get: function get() {
          return y;
        },
        set: function set(value) {
          y = value;
          this.el.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scaleX + ', ' + scaleY + ')';
        }
      });

      Object.defineProperty(this, 'scaleX', {
        get: function get() {
          return scaleX;
        },
        set: function set(value) {
          scaleX = value;
          this.el.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scaleX + ', ' + scaleY + ')';
        }
      });

      Object.defineProperty(this, 'scaleY', {
        get: function get() {
          return scaleY;
        },
        set: function set(value) {
          scaleY = value;
          this.el.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scaleX + ', ' + scaleY + ')';
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

      this.el.addEventListener('dragstart', this);
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
        case 'dragstart':
          event.preventDefault();
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
      var _this = this;

      event.preventDefault();
      event.stopPropagation();

      clearTimeout(this.timer);
      this.flag = false;
      this.timer = setTimeout(function () {
        _this.scaleX = 1.1;
        _this.scaleY = 1.1;
        _this.flag = true;
      }, this.options.dragDelay);

      var _eventType = eventType[event.type];
      if (_eventType !== TOUCH_EVENT && event.button !== 0) {
        return;
      }
      this.initiated = _eventType;

      this.el.style.transitionDuration = '0ms';
      this.el.style.zIndex = 2;

      var touch = event.touches ? event.touches[0] : event;
      this.startX = parseInt(this.x);
      this.startY = parseInt(this.y);
      this._pageX = touch.pageX;
      this._pageY = touch.pageY;
    };

    Element.prototype._move = function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (eventType[event.type] !== this.initiated || !this.flag) {
        return;
      }

      var touch = event.touches ? event.touches[0] : event;
      var deltaX = touch.pageX - this._pageX;
      var deltaY = touch.pageY - this._pageY;
      this.x = this.startX + deltaX;
      this.y = this.startY + deltaY;

      if (this.moveEvent) {
        this.moveEvent(this);
      }
    };

    Element.prototype._end = function (event) {
      event.preventDefault();
      event.stopPropagation();

      clearTimeout(this.timer);

      if (eventType[event.type] !== this.initiated) {
        return;
      }
      this.initiated = null;

      if (this.endEvent) {
        this.endEvent(this);
      }

      this.isInTransition = true;
      this.el.style.transitionDuration = this.options.transitionDuration + 'ms';

      if (this.endX !== null) {
        this.x = this.endX;
      } else {
        this.x = this.startX;
      }
      if (this.endY !== null) {
        this.y = this.endY;
      } else {
        this.y = this.startY;
      }

      this.endX = null;
      this.endY = null;
      this.scaleX = 1;
      this.scaleY = 1;
      this.el.style.zIndex = 1;

      if (this.moveEvent) {
        this.moveEvent(this);
      }
    };

    Element.prototype._transitionEnd = function (event) {
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

  var Draggable = function Draggable(el, options) {
    classCallCheck(this, Draggable);

    this.el = el;
    this.options = options;

    this._init(options);
  };


  initMixin(Draggable);
  coreMixin(Draggable);

  var Wrapper = function () {
    function Wrapper(el, options) {
      classCallCheck(this, Wrapper);

      this.el = el;
      this.options = options;

      this.slots = [];
      this.lastIdx = -1;
      this.column = Math.floor(this.el.offsetWidth / this.options.elementSize);
      this.row = 0;
    }

    createClass(Wrapper, [{
      key: 'removeElement',
      value: function removeElement() {
        console.log(this.el.children);
      }
    }, {
      key: 'appendElement',
      value: function appendElement(el, id) {
        var elementSize = this.options.elementSize;
        var idx = ++this.lastIdx;

        var maskEl = document.createElement('div');
        maskEl.style.position = 'absolute';
        maskEl.style.display = 'inline-block';
        maskEl.style.boxSizing = 'border-box';
        maskEl.style.top = '5px';
        maskEl.style.left = '5px';
        maskEl.style.height = elementSize - 5 * 2 + 'px';
        maskEl.style.width = elementSize - 5 * 2 + 'px';
        maskEl.style.padding = '5px';
        maskEl.style.backgroundColor = 'rgba(0,0,0,.5)';

        var divEl = document.createElement('div');
        divEl.appendChild(el);
        // divEl.appendChild(maskEl)
        divEl.style.position = 'absolute';
        divEl.style.display = 'inline-block';
        divEl.style.boxSizing = 'border-box';
        divEl.style.overflow = 'hidden';
        divEl.style.width = divEl.style.height = elementSize + 'px';
        divEl.style.padding = '5px';
        divEl.style.transition = 'all 1s';
        divEl.dataset.id = id;
        var x = this.slots.length % this.column * elementSize;
        var y = (this.slots.length % this.column === 0 ? this.row++ : this.row - 1) * elementSize;

        this.el.appendChild(divEl);

        var element = new Draggable(divEl, this.options);
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
        this.el.style.height = this.row * elementSize + 'px';
      }
    }, {
      key: '_moveEventHandle',
      value: function _moveEventHandle(source) {
        if (typeof this.options.moveEvent === 'function') {
          this.options.moveEvent();
        }

        var idx = this._judge(source.x, source.y);
        if (idx !== source.idx) {
          if (idx < source.idx) {
            for (var i = source.idx; i > idx; i--) {
              var current = this.slots[i];
              var last = this.slots[i - 1];
              last.el.x = current.x;
              last.el.y = current.y;
              last.el.idx = i;
              current.el = last.el;
            }
          } else {
            for (var _i = source.idx; _i < idx; _i++) {
              var _current = this.slots[_i];
              var next = this.slots[_i + 1];
              next.el.x = _current.x;
              next.el.y = _current.y;
              next.el.idx = _i;
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
        var elementSize = this.options.elementSize;
        var extra = 0.5 * elementSize;
        var minX = -extra;
        var maxX = this.slots.length < this.column ? (this.slots.length - 1) * elementSize + extra : (this.column - 1) * elementSize + extra;
        var minY = -extra;
        var maxY = this.row >= 2 ? maxY = (this.row - 2) * elementSize + extra : (this.row - 1) * elementSize + extra;

        if (x < minX && y < minY) {
          return 0;
        } else if (x < minX && y > maxY) {
          return (this.row - 1) * this.column;
        } else if (x > maxX && y < minY) {
          if (this.slots.length >= this.column) {
            return this.column - 1;
          } else {
            return this.slots.length - 1;
          }
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
        } else if (x > maxX) {
          for (var i = this.column - 1; i < this.slots.length; i += this.column) {
            var slot = this.slots[i];
            if (y >= slot.y - extra && y < slot.y + extra) {
              return i;
            }
          }
          return this.slots.length - 1;
        } else if (x < minX) {
          for (var _i2 = 0; _i2 < this.slots.length; _i2 += this.column) {
            var _slot = this.slots[_i2];
            if (y >= _slot.y - extra && y < _slot.y + extra) {
              return _i2;
            }
          }
          return 0;
        } else if (y < minY) {
          var end = this.slots.length >= this.column ? this.column : this.slots.length;
          for (var _i3 = 0; _i3 < end; _i3++) {
            if (x >= this.slots[_i3].x - extra && x < this.slots[_i3].x + extra) {
              return _i3;
            }
          }
        } else if (y > maxY) {
          var start = (this.row - 1) * this.column;
          var _end = this.slots.length > this.column ? this.row * this.column : this.slots.length;
          for (var _i4 = start; _i4 < _end; _i4++) {
            var _slot2 = this.slots[_i4] ? this.slots[_i4] : this.slots[_i4 - this.column];
            var result = this.slots[_i4] ? _i4 : _i4 - this.column;
            if (x >= _slot2.x - extra && x < _slot2.x + extra) {
              return result;
            }
          }
        }
        for (var _i5 = 0, len = this.slots.length; _i5 < len; _i5++) {
          var _slot3 = this.slots[_i5];
          if (x > _slot3.x - extra && x < _slot3.x + extra && y > _slot3.y - extra && y < _slot3.y + extra) {
            return _i5;
          }
        }
      }
    }]);
    return Wrapper;
  }();

  var Store = function () {
    function Store() {
      classCallCheck(this, Store);

      this.nextId = 0;
      this.map = {};
    }

    createClass(Store, [{
      key: "add",
      value: function add(data) {
        this.map[this.nextId++] = data;
        return this.nextId - 1;
      }
    }, {
      key: "remove",
      value: function remove(id) {
        if (this.map[id]) {
          this.map[id] = null;
          return ture;
        }
        return false;
      }
    }, {
      key: "get",
      value: function get$$1(id) {
        return this.map[id];
      }
    }, {
      key: "all",
      value: function all() {
        var files = [];
        for (var key in this.map) {
          if (this.map[key]) {
            files.push(this.map[key]);
          }
        }
        return files;
      }
    }]);
    return Store;
  }();

  var DEFAULT_OPTIONS$1 = {
    elementSize: 100,
    elementPadding: 5,
    elementDragScale: 1.1,
    dragDelay: 200,
    transitionDuration: 300,
    useTransform: true,
    api: '/api/upload'
  };

  function initMixin$1(ImageUpload) {
    ImageUpload.prototype._init = function (options) {
      this._handleOptions(options);
      this._initWrapper();
      this.store = new Store();
    };

    ImageUpload.prototype.remove = function (id) {
      // this.store.remove(id)
      this.wrapper.removeElement();
    };

    ImageUpload.prototype.send = function () {
      var formData = new FormData();
      formData.append('file', window.file);
      formData.append('name', 'symind');
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:8080/api/upload');
      xhr.send(formData);
    };

    ImageUpload.prototype._handleOptions = function (options) {
      this.options = extend({}, DEFAULT_OPTIONS$1, options);

      this.translateZ = this.options.HWCompositing ? ' translateZ(0)' : '';

      this.options.useTransition = this.options.useTransition && hasTransition;
      this.options.useTransform = this.options.useTransform && hasTransform;
    };

    ImageUpload.prototype._initWrapper = function () {
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
      this.inputEl = inputEl;

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

  function warn(msg) {
    console.error("[ImageUpload warn]: " + msg);
  }

  function info(msg) {
    console.info("[ImageUpload info]: " + msg);
  }

  function eventMixin(ImageUpload) {
    ImageUpload.prototype._change = function (event) {
      var _this = this;

      var file = event.srcElement.files[0];
      var id = this.store.add(file);

      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadstart = function (e) {
        info("开始读取....");
      };
      reader.onprogress = function (e) {
        info("正在读取中....");
      };
      reader.onabort = function (e) {
        info("中断读取....");
      };
      reader.onerror = function (e) {
        info("读取异常....");
      };

      reader.onload = function (event) {
        _this._compress(event.target.result).then(function (dataUrl) {
          var divEl = document.createElement('div');
          divEl.style.height = '100%';
          divEl.style.backgroundImage = "url(" + dataUrl + ")";
          divEl.style.backgroundRepeat = 'no-repeat';
          divEl.style.backgroundSize = 'cover';
          divEl.style.backgroundPosition = 'center';
          _this.wrapper.appendElement(divEl, id);

          _this._layout();
          _this._send();
        }).catch(function (error) {
          console.log(error);
          alert('失败了');
        });
      };
    };

    ImageUpload.prototype._send = function (file) {
      var xhr = new XMLHttpRequest();
    };

    ImageUpload.prototype._layout = function () {
      var last = this.wrapper.slots.length % this.wrapper.column;
      var elementSize = this.options.elementSize;
      if (last === 0) {
        this.labelEl.style.top = this.wrapper.row * elementSize + 'px';
        this.labelEl.style.left = 0;
      } else {
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

  ImageUpload.Draggable = Draggable;

  return ImageUpload;

})));
