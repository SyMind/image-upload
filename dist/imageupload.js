(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.ImageUpload = factory());
}(this, (function () { 'use strict';

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

  var Element = function () {
    function Element(el) {
      classCallCheck(this, Element);

      this.el = el;

      this.endX = null;
      this.endY = null;

      this.moveEvent = null;
      this.endEvent = null;

      var isTransition = false;
      Object.defineProperty(this, 'isTransition', {
        get: function get$$1() {
          return isTransition;
        },
        set: function set$$1(value) {
          isTransition = value;
          var pointerEvents = isTransition ? 'none' : 'auto';
          this.el.style.pointerEvents = pointerEvents;
        }
      });

      this._x = 0;
      this._y = 0;

      Object.defineProperty(this, 'x', {
        get: function get$$1() {
          // return this.el.offsetLeft
          return this._x;
        },
        set: function set$$1(value) {
          // this.el.style.left = value + 'px'
          this._x = value;
          this.el.style.transform = 'translate3d(' + this._x + 'px, ' + this._y + 'px, 0)';
        }
      });

      Object.defineProperty(this, 'y', {
        get: function get$$1() {
          // return this.el.offsetTop
          return this._y;
        },
        set: function set$$1(value) {
          // this.el.style.top = value + 'px'
          this._y = value;
          this.el.style.transform = 'translate3d(' + this._x + 'px, ' + this._y + 'px, 0)';
        }
      });

      el.addEventListener('touchstart', this);
      el.addEventListener('touchmove', this);
      el.addEventListener('touchend', this);
      el.addEventListener('transitionEnd', this);
      el.addEventListener('webkitTransitionEnd', this);
      el.addEventListener('oTransitionEnd', this);
      el.addEventListener('MSTransitionEnd', this);
    }

    createClass(Element, [{
      key: 'handleEvent',
      value: function handleEvent(e) {
        switch (e.type) {
          case 'touchstart':
            this._start(e);
            break;
          case 'touchmove':
            this._move(e);
            break;
          case 'touchend':
            this._end(e);
            break;
          case 'transitionEnd':
          case 'webkitTransitionEnd':
          case 'oTransitionEnd':
          case 'MSTransitionEnd':
            this._transitionEnd(e);
            break;
        }
      }
    }, {
      key: 'moveTo',
      value: function moveTo(x, y) {
        this.el.style.transitionDuration = '500ms';

        this.x = x;
        this.y = y;
      }
    }, {
      key: '_start',
      value: function _start(event) {
        this.el.style.zIndex = 2;

        var touch = event.touches[0];
        this.startX = parseInt(this.el.offsetLeft);
        this.startY = parseInt(this.el.offsetTop);
        this._pageX = touch.pageX;
        this._pageY = touch.pageY;
      }
    }, {
      key: '_move',
      value: function _move(event) {
        this.el.style.transitionDuration = '0ms';

        var touch = event.touches[0];
        var deltaX = touch.pageX - this._pageX;
        var deltaY = touch.pageY - this._pageY;
        this.x = this.startX + deltaX;
        this.y = this.startY + deltaY;

        if (this.moveEvent) this.moveEvent(this);
      }
    }, {
      key: '_end',
      value: function _end(event) {
        if (this.endEvent) this.endEvent(this);

        this.isTransition = true;
        this.el.style.transitionDuration = '500ms';

        if (this.endX !== null) this.x = this.endX;else this.x = this.startX;
        if (this.endY !== null) this.y = this.endY;else this.y = this.startY;

        this.endX = null;
        this.endY = null;
      }
    }, {
      key: '_transitionEnd',
      value: function _transitionEnd(event) {
        this.isTransition = false;
      }
    }]);
    return Element;
  }();

  var Wrapper = function () {
    function Wrapper(el, options) {
      classCallCheck(this, Wrapper);

      this.el = el;
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
        divEl.style.padding = '5px';
        divEl.style.transition = 'all 1s';
        var x = this.slots.length % this.column * this.elementSize;
        var y = (this.slots.length % this.column === 0 ? this.row++ : this.row - 1) * this.elementSize;
        // divEl.style.transform = `translate3d(${x}px, ${y}px, 0)`
        // divEl.style.left = (this.slots.length % this.column) * this.elementSize + 'px'
        // divEl.style.top = (this.slots.length % this.column === 0 ? this.row++ : this.row - 1) * this.elementSize + 'px'

        this.el.appendChild(divEl);

        var element = new Element(divEl);
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

  var ImageUpload = function () {
    function ImageUpload(el, options) {
      classCallCheck(this, ImageUpload);

      this.el = el;
      this.options = Object.assign({
        size: '78px',
        padding: '5px'
      }, options);
    }

    createClass(ImageUpload, [{
      key: 'init',
      value: function init() {
        var labelEl = this.labelEl = document.createElement('label');
        labelEl.style.display = 'inline-block';
        labelEl.style.boxSizing = 'border-box';
        labelEl.style.position = 'absolute';
        labelEl.style.height = this.options.size;
        labelEl.style.width = this.options.size;
        labelEl.style.padding = this.options.padding;
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

        this.wrapper = new Wrapper(wrapperEl);

        this.el.style.position = 'relative';
        this.el.style.minHeight = this.wrapper.elementSize + 'px';

        inputEl.addEventListener('change', this);
      }
    }, {
      key: 'handleEvent',
      value: function handleEvent(event) {
        switch (event.type) {
          case 'change':
            this._change(event);
            break;
        }
      }
    }, {
      key: '_change',
      value: function _change(event) {
        var _this = this;

        var file = event.srcElement.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
          _this._compress(event.target.result, function (dataUrl) {
            var divEl = document.createElement('div');
            divEl.style.height = '100%';
            divEl.style.backgroundImage = 'url(' + dataUrl + ')';
            divEl.style.backgroundRepeat = 'no-repeat';
            divEl.style.backgroundSize = 'cover';
            divEl.style.backgroundPosition = 'center';
            _this.wrapper.appendElement(divEl);
            _this._adjust();
          });
        };
      }
    }, {
      key: '_adjust',
      value: function _adjust() {
        var last = this.wrapper.slots.length % this.wrapper.column;
        if (last === 0) {} else {
          this.labelEl.style.top = (this.wrapper.row - 1) * this.wrapper.elementSize + 'px';
          this.labelEl.style.left = last * this.wrapper.elementSize + 'px';
        }
      }
    }, {
      key: '_compress',
      value: function _compress(dataUrl, callback) {
        var _this2 = this;

        if (!this.canvas) {
          this.canvas = document.createElement('canvas');
          this.context = this.canvas.getContext('2d');
        }

        var image = new Image();
        image.src = dataUrl;
        image.onload = function () {
          _this2.canvas.width = image.naturalWidth;
          _this2.canvas.height = image.naturalHeight;
          _this2.context.clearRect(0, 0, image.naturalWidth, image.naturalHeight);
          _this2.context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
          callback(_this2.canvas.toDataURL('image/jpeg', 0.8));
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

  return ImageUpload;

})));
