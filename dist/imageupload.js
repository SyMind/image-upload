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

      Object.defineProperty(this, 'x', {
        get: function get$$1() {
          return this.el.offsetLeft;
        },
        set: function set$$1(value) {
          this.el.style.left = value + 'px';
        }
      });

      Object.defineProperty(this, 'y', {
        get: function get$$1() {
          return this.el.offsetTop;
        },
        set: function set$$1(value) {
          this.el.style.top = value + 'px';
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
    function Wrapper(el) {
      classCallCheck(this, Wrapper);

      this.el = el;
      this.slots = [];
      this.lastIdx = -1;
      this.elementSize = 78;
      this.col = Math.floor(this.el.offsetWidth / this.elementSize);
      this.row = 0;
    }

    createClass(Wrapper, [{
      key: 'addElement',
      value: function addElement(el) {
        var idx = ++this.lastIdx;

        var divEl = document.createElement('div');
        divEl.appendChild(el);
        divEl.className = 'item item' + idx;
        divEl.style.overflow = 'hidden';
        divEl.style.left = this.slots.length % this.col * this.elementSize + 'px';
        divEl.style.top = (this.slots.length % this.col === 0 ? this.row++ : this.row - 1) * this.elementSize + 'px';

        this.el.appendChild(divEl);

        var element = new Element(divEl);
        element.idx = idx;
        element.moveEvent = this._moveEventHandle.bind(this);
        element.endEvent = this._endEventHandle.bind(this);

        this.slots.push({
          x: element.x,
          y: element.y,
          el: element
        });

        this.row = Math.ceil(this.slots.length / this.col);
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
        var maxX = (this.col - 1) * this.elementSize + extra;
        var minY = -extra;
        var maxY = (this.row - 1) * this.elementSize + extra;
        if (this.row >= 2) maxY = (this.row - 2) * this.elementSize + extra;

        if (x < minX && y < minY) {
          return 0;
        } else if (x > maxX && y < minY) {
          if (this.slots.length >= this.col) return this.col - 1;else return this.slots.length - 1;
        } else if (x < minX && y > maxY) {
          return (this.row - 1) * this.col;
        } else if (x > maxX && y > maxY) {
          var idx = this.row * this.col - 1;
          if (idx >= this.slots.length) return idx - this.col;else return idx;
        } else if (y < minY) {
          var end = this.slots.length >= this.col ? this.col : this.slots.length;
          for (var i = 0; i < end; i++) {
            if (x >= this.slots[i].x - extra && x < this.slots[i].x + extra) {
              return i;
            }
          }
        } else if (y > maxY) {
          var start = (this.row - 1) * this.col;
          var _end = this.row * this.col;
          for (var _i2 = start; _i2 < _end; _i2++) {
            var slot = this.slots[_i2];
            var result = _i2;
            if (!this.slots[_i2]) {
              slot = this.slots[_i2 - this.col];
              var _result = _i2 - this.col;
            }
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
      this.options = Object.assign({}, options);
    }

    createClass(ImageUpload, [{
      key: 'init',
      value: function init() {
        var labelEl = document.createElement('label');
        labelEl.style.display = 'inline-block';
        labelEl.style.boxSizing = 'border-box';
        labelEl.style.position = 'relative';
        labelEl.style.verticalAlign = 'top';
        labelEl.style.height = '78px';
        labelEl.style.width = '78px';
        labelEl.style.border = '1px solid #aaa';
        labelEl.setAttribute('for', 'imageUploadInputEl');

        var hEl = document.createElement('div');
        var vEl = document.createElement('div');
        hEl.style.display = vEl.style.display = 'inline-block';
        hEl.style.boxSizing = vEl.style.boxSizing = 'border-box';
        hEl.style.position = vEl.style.position = 'absolute';
        hEl.style.width = vEl.style.height = '60%';
        hEl.style.height = vEl.style.width = '2px';
        hEl.style.left = vEl.style.top = '20%';
        hEl.style.top = vEl.style.left = '50%';
        hEl.style.backgroundColor = vEl.style.backgroundColor = '#aaa';
        labelEl.appendChild(hEl);
        labelEl.appendChild(vEl);

        var inputEl = document.createElement('input');
        inputEl.id = 'imageUploadInputEl';
        inputEl.style.display = 'none';
        inputEl.type = 'file';

        var wrapperEl = document.createElement('div');
        wrapperEl.style.position = 'relative';
        wrapperEl.style.width = '100%';
        wrapperEl.style.backgroundColor = 'green';

        this.el.appendChild(wrapperEl);
        this.el.appendChild(labelEl);
        this.el.appendChild(inputEl);

        this.wrapper = new Wrapper(wrapperEl);
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
            var imageEl = document.createElement('img');
            imageEl.src = dataUrl;
            _this.wrapper.addElement(imageEl);
          });
        };
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
          _this2.context.clearRect(0, 0, _this2.canvas.width, _this2.canvas.height);
          _this2.context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
          callback(_this2.canvas.toDataURL('image/jpeg', 0.8));
        };
      }
    }]);
    return ImageUpload;
  }();

  return ImageUpload;

})));
