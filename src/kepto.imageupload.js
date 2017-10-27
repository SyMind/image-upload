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
            this.$container = $('<div class="image-upload">').append(this.$button),

            this.$root.append(this.$container);

            this.$input.change(() => {
                let file = this.$input[0].files[0],
                    reader = new FileReader();

                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    this.compress(e.target.result, (compress_data_url) => 
                        this.$container.prepend($('<div class="image-upload-item"></div>')
                            .css('background-image', `url(${compress_data_url})`)));
                }
            });
        }

        compress(data_url, callback) {
            let image = new Image();
            image.src = data_url;
            image.onload = () => {
                this.context.drawImage(image, 0, 0);
                callback(this.canvas.toDataURL('image/jpeg', 0.8));
            }
        }

        create() {
            this.init();
        }
    }
    $.extend($.fn, {
        imageUpload: function (icon) {
            let loader = new ImageUpload(this, icon);
            loader.create();
        }
    })
    
})(Zepto);
