(function ($) {
    class ImageUpload {
        
        constructor($root, options) {
            this.$root = $root;
            this.count = 0;
            this.icon = options.icon ? options.icon : false;
            this.url = options.url ? options.icon : false;
        }

        init() {
            this.$button = $('<div class="image-upload-button">');
            this.$label = $('<label class="image-upload-label" for="image-upload-input">');
            if(this.icon) this.$label.css('background-image', `url("${this.icon}")`);
            else this.$label.text('click');
            this.$input = $('<input style="display:none" id="image-upload-input" type="file">');
            this.canvas = $('<canvas style="display:none">')[0];
            this.context = this.canvas.getContext('2d');
            this.$button.append(this.$label).append(this.$input);
            this.$list = $('<div class="image-upload-list">');
            this.$container = $('<div class="image-upload">').append(this.$list).append(this.$button),

            this.$root.append(this.$container);

            this.$input.change(() => {
                let file = this.$input[0].files[0],
                    reader = new FileReader();
                console.log(file);
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    this.compress(e.target.result, (compress_data_url) =>  {
                        this.$list.append($('<div class="image-upload-item"><div class="image-upload-close"></div></div>')
                            .css('background-image', `url(${compress_data_url})`));
                        if(this.send(file)) {
                          // upload success
                          
                        } else {
                          // upload fail
                        }
                    });
                }
            });

            this.$root.click(function(e) {
              if(e.target.className === 'image-upload-close') {
                $(e.target.parentNode).remove();
              }
            });
        }

        compress(data_url, callback) {
            let image = new Image();
            image.src = data_url;
            image.onload = () => {
                this.canvas.height = image.naturalHeight;
                this.canvas.width = image.naturalWidth;
                this.context.clearRect(0, 0 , this.canvas.width, this.canvas.height);
                this.context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
                callback(this.canvas.toDataURL('image/jpeg', 0.8));
            }
        }

        dataUrlToBlob(data_url) {
          let arr = data_url.split(','), mime = arr[0].match()
        }

        create() {
            this.init();
        }

        send(file) {
          if(!this.url) {
            console.log('fail');
            return false;
          }
          let xhr = new XMLHttpRequest(),
              fd = new FormData(),
              preTime,
              preSize;

          xhr.open('POST', this.url, true);
          xhr.onreadystatechange = function() {
            if(xhr.readState === 4 && xhr.status === 200) {
              alert(xhr.responseText);
            }
          };
          xhr.upload.onloadstart = function() {
            preTime = new Date().getTime();
            preSize = 0;
          };
          xhr.upload.onprogress = function(e) {
            let now = new Date().getTime(),
                spend = (now - preTime) / 1000,
                sect = e.loaded - preSize;
            console.log(spend, sect);
          };
          fd.append('image', file);
          xhr.send(fd);
        }
    }

    $.extend($.fn, {
        imageUpload: function (options) {
            let loader = new ImageUpload(this, options);
            loader.create();
            return loader;
        }
    })
    
})(Zepto);
