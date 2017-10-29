(function ($) {
    class ImageUpload {
        
        constructor($root, icon) {
            this.$root = $root;
            this.count = 0;
            this.icon = icon ? icon : false;
        }

        init() {
            this.$button = $('<div class="image-upload-button">');
            this.$label = $('<label class="image-upload-label" for="image-upload-input">');
            if(this.icon) this.$label.css('background-image', `url("${this.icon}")`);
            else this.$label.text('点击');
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
                        $.ajax({
                          url: 'upload',
                          type: 'POST',
                          data: new FormData()
                        })
                    });
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

        event() {
          this.$root.click(function(e) {
            if(e.target.className === 'image-upload-close') {
              $(e.target.parentNode).remove();
            }
          });
        }

        create() {
            this.init();
            this.event();
        }
    }
    $.extend($.fn, {
        imageUpload: function (icon) {
            let loader = new ImageUpload(this, icon);
            loader.create();
        }
    })
    
})(Zepto);
