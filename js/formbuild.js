$(document).ready(function() {
    let idCounter = 1;
    let selectedElement = null;

    // Làm cho các công cụ có thể kéo
    $(".tool-item").draggable({
        helper: "clone",
        cursor: "move",
        revert: "invalid"
    });

    // Làm cho canvas có thể nhận các phần tử kéo thả
    $("#canvas").droppable({
        accept: ".tool-item",
        drop: function(event, ui) {
            const type = $(ui.helper).data("type");
            const offset = $(this).offset();
            const x = ui.position.left - offset.left;
            const y = ui.position.top - offset.top;
            
            // Tạo phần tử mới trên canvas
            createElementOnCanvas(type, x, y);
        }
    });

    // Tạo phần tử mới trên canvas
    function createElementOnCanvas(type, x, y) {
        const id = `element-${type}-${idCounter++}`;
        let element;
        
        switch(type) {
            case 'heading':
                element = $(`<div id="${id}" class="canvas-item" data-type="${type}"><h2>Tiêu đề mẫu</h2><div class="resize-handle"></div></div>`);
                break;
            case 'paragraph':
                element = $(`<div id="${id}" class="canvas-item" data-type="${type}"><p>Đây là đoạn văn mẫu. Bạn có thể chỉnh sửa nội dung.</p><div class="resize-handle"></div></div>`);
                break;
            case 'button':
                element = $(`<div id="${id}" class="canvas-item" data-type="${type}"><button>Nút</button><div class="resize-handle"></div></div>`);
                break;
            case 'textbox':
                element = $(`<div id="${id}" class="canvas-item" data-type="${type}"><input type="text" placeholder="Nhập văn bản"><div class="resize-handle"></div></div>`);
                break;
            case 'image':
                element = $(`<div id="${id}" class="canvas-item" data-type="${type}"><div style="text-align:center;padding:10px;">Hình ảnh (Placeholder)</div><div class="resize-handle"></div></div>`);
                break;
            case 'container':
                element = $(`<div id="${id}" class="canvas-item" data-type="${type}" style="background-color:#f7f7f7;min-height:100px;"><div class="component-title">Container</div><div class="resize-handle"></div></div>`);
                break;
            default:
                element = $(`<div id="${id}" class="canvas-item" data-type="${type}">Phần tử mới<div class="resize-handle"></div></div>`);
        }
        
        // Đặt vị trí cho phần tử
        element.css({
            left: x + 'px',
            top: y + 'px'
        });
        
        // Thêm phần tử vào canvas
        $("#canvas").append(element);
        
        // Làm cho phần tử có thể di chuyển
        element.draggable({
            containment: "#canvas",
            handle: ":not(.resize-handle)",
            stop: function(event, ui) {
                if (selectedElement && selectedElement.attr('id') === $(this).attr('id')) {
                    updatePropertyPanel();
                }
            }
        });
        
        // Làm cho phần tử có thể thay đổi kích thước
        element.find('.resize-handle').mousedown(function(e) {
            const $parent = $(this).parent();
            const startX = e.pageX;
            const startY = e.pageY;
            const startWidth = $parent.width();
            const startHeight = $parent.height();
            
            $(document).mousemove(function(e) {
                const newWidth = startWidth + (e.pageX - startX);
                const newHeight = startHeight + (e.pageY - startY);
                
                $parent.width(newWidth > 50 ? newWidth : 50);
                $parent.height(newHeight > 30 ? newHeight : 30);
                
                if (selectedElement && selectedElement.attr('id') === $parent.attr('id')) {
                    $('#element-width').val(Math.round(newWidth));
                    $('#element-height').val(Math.round(newHeight));
                }
                
                e.preventDefault();
            });
            
            $(document).mouseup(function() {
                $(document).off('mousemove');
                $(document).off('mouseup');
            });
            
            e.preventDefault();
        });
        
        // Xử lý sự kiện click để chọn phần tử
        element.click(function(e) {
            e.stopPropagation();
            selectElement($(this));
        });
        
        // Chọn phần tử vừa tạo
        selectElement(element);
    }
    
    // Chọn phần tử và hiển thị thuộc tính
    function selectElement(element) {
        // Bỏ chọn phần tử trước đó
        if (selectedElement) {
            selectedElement.removeClass('selected');
        }
        
        // Đánh dấu phần tử được chọn
        selectedElement = element;
        selectedElement.addClass('selected');
        
        // Hiển thị thuộc tính
        updatePropertyPanel();
        
        $('#no-selection').hide();
        $('#property-panel').show();
    }
    
    // Cập nhật panel thuộc tính
    function updatePropertyPanel() {
        if (!selectedElement) return;
        
        const id = selectedElement.attr('id');
        const type = selectedElement.data('type');
        const position = selectedElement.position();
        
        $('#element-id').val(id);
        $('#element-x').val(Math.round(position.left));
        $('#element-y').val(Math.round(position.top));
        $('#element-width').val(Math.round(selectedElement.width()));
        $('#element-height').val(Math.round(selectedElement.height()));
        
        // Xử lý nội dung dựa trên loại phần tử
        let contentElement;
        switch(type) {
            case 'heading':
                contentElement = selectedElement.find('h2');
                $('#element-text').val(contentElement.text());
                break;
            case 'paragraph':
                contentElement = selectedElement.find('p');
                $('#element-text').val(contentElement.text());
                break;
            case 'button':
                contentElement = selectedElement.find('button');
                $('#element-text').val(contentElement.text());
                break;
            case 'textbox':
                contentElement = selectedElement.find('input');
                $('#element-text').val(contentElement.attr('placeholder'));
                break;
            default:
                // Nếu là container hoặc loại khác
                $('#element-text').val(selectedElement.text());
                break;
        }
        
        // Lấy style hiện tại
        const color = selectedElement.css('color');
        const bgColor = selectedElement.css('background-color');
        const fontSize = parseInt(selectedElement.css('font-size'));
        
        $('#element-color').val(rgbToHex(color));
        $('#element-background').val(rgbToHex(bgColor));
        $('#element-font-size').val(fontSize || 16);
    }
    
    // Chuyển đổi RGB sang Hex
    function rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') {
            return '#ffffff';
        }
        
        // Nếu đã là định dạng hex
        if (rgb.charAt(0) === '#') {
            return rgb;
        }
        
        // Chuyển đổi từ rgb(r,g,b) sang #rrggbb
        const rgbRegex = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
        const match = rgb.match(rgbRegex);
        
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            
            return '#' + 
                (r.toString(16).padStart(2, '0')) +
                (g.toString(16).padStart(2, '0')) +
                (b.toString(16).padStart(2, '0'));
        }
        
        return '#ffffff';
    }
    
    // Xử lý sự kiện thay đổi thuộc tính
    $('.property-input').on('change input', function() {
        if (!selectedElement) return;
        
        const id = $('#element-id').val();
        const text = $('#element-text').val();
        const x = parseInt($('#element-x').val());
        const y = parseInt($('#element-y').val());
        const width = parseInt($('#element-width').val());
        const height = parseInt($('#element-height').val());
        const color = $('#element-color').val();
        const bgColor = $('#element-background').val();
        const fontSize = $('#element-font-size').val() + 'px';
        
        // Cập nhật ID
        selectedElement.attr('id', id);
        
        // Cập nhật vị trí và kích thước
        selectedElement.css({
            left: x + 'px',
            top: y + 'px',
            width: width + 'px',
            height: height + 'px',
            color: color,
            backgroundColor: bgColor,
            fontSize: fontSize
        });
        
        // Cập nhật nội dung dựa trên loại phần tử
        const type = selectedElement.data('type');
        switch(type) {
            case 'heading':
                selectedElement.find('h2').text(text);
                break;
            case 'paragraph':
                selectedElement.find('p').text(text);
                break;
            case 'button':
                selectedElement.find('button').text(text);
                break;
            case 'textbox':
                selectedElement.find('input').attr('placeholder', text);
                break;
            case 'image':
                // Trong trường hợp là hình ảnh, văn bản này sẽ là alt text
                selectedElement.find('div').text(text);
                break;
            case 'container':
                selectedElement.find('.component-title').text(text);
                break;
        }
    });
    
    // Xóa phần tử đã chọn
    $('#delete-element').click(function() {
        if (selectedElement) {
            selectedElement.remove();
            selectedElement = null;
            $('#no-selection').show();
            $('#property-panel').hide();
        }
    });
    
    // Bỏ chọn khi click vào canvas
    $('#canvas').click(function(e) {
        if (e.target === this) {
            if (selectedElement) {
                selectedElement.removeClass('selected');
                selectedElement = null;
            }
            $('#no-selection').show();
            $('#property-panel').hide();
        }
    });
    
    // Xóa tất cả phần tử trên canvas
    $('#clear-canvas').click(function() {
        if (confirm('Bạn có chắc muốn xóa tất cả phần tử trên canvas?')) {
            $('#canvas').empty();
            selectedElement = null;
            $('#no-selection').show();
            $('#property-panel').hide();
        }
    });
    
    // Lưu thiết kế (Giả lập gửi đến ASP.NET Web Forms)
    $('#save-design').click(function() {
        // Tạo đối tượng chứa dữ liệu thiết kế
        const designData = {
            elements: []
        };
        
        // Thu thập thông tin từ tất cả phần tử
        $('.canvas-item').each(function() {
            const $el = $(this);
            const element = {
                id: $el.attr('id'),
                type: $el.data('type'),
                x: parseInt($el.css('left')),
                y: parseInt($el.css('top')),
                width: $el.width(),
                height: $el.height(),
                color: $el.css('color'),
                backgroundColor: $el.css('background-color'),
                fontSize: $el.css('font-size')
            };
            
            // Thêm nội dung dựa trên loại phần tử
            switch(element.type) {
                case 'heading':
                    element.text = $el.find('h2').text();
                    break;
                case 'paragraph':
                    element.text = $el.find('p').text();
                    break;
                case 'button':
                    element.text = $el.find('button').text();
                    break;
                case 'textbox':
                    element.placeholder = $el.find('input').attr('placeholder');
                    break;
                case 'image':
                    element.altText = $el.find('div').text();
                    break;
                case 'container':
                    element.title = $el.find('.component-title').text();
                    break;
            }
            
            designData.elements.push(element);
        });
        
        // Giả lập gửi dữ liệu đến server ASP.NET
        alert('Chức năng lưu vào cơ sở dữ liệu sẽ được thực hiện bằng AJAX gửi tới back-end ASP.NET Web Forms');
        console.log('Design Data:', designData);
        
        // Trong thực tế, bạn sẽ sử dụng Ajax để gửi dữ liệu
        /*
        $.ajax({
            type: "POST",
            url: "SaveDesign.aspx/SaveDesignData",
            data: JSON.stringify({ designData: designData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                alert("Thiết kế đã được lưu thành công!");
            },
            error: function(error) {
                alert("Có lỗi xảy ra khi lưu thiết kế: " + error.responseText);
            }
        });
        */
    });
    
    // Xuất code HTML
    $('#generate-html').click(function() {
        let htmlOutput = '<!DOCTYPE html>\n<html>\n<head>\n';
        htmlOutput += '    <title>Thiết kế của bạn</title>\n';
        htmlOutput += '    <style>\n';
        htmlOutput += '        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }\n';
        htmlOutput += '        .container { position: relative; width: 100%; height: 100vh; }\n';
        
        // Thu thập style cho từng phần tử
        $('.canvas-item').each(function() {
            const $el = $(this);
            const id = $el.attr('id');
            
            htmlOutput += `        #${id} {\n`;
            htmlOutput += `            position: absolute;\n`;
            htmlOutput += `            left: ${parseInt($el.css('left'))}px;\n`;
            htmlOutput += `            top: ${parseInt($el.css('top'))}px;\n`;
            htmlOutput += `            width: ${$el.width()}px;\n`;
            htmlOutput += `            height: ${$el.height()}px;\n`;
            
            if ($el.css('color') !== 'transparent' && $el.css('color') !== 'rgba(0, 0, 0, 0)') {
                htmlOutput += `            color: ${$el.css('color')};\n`;
            }
            
            if ($el.css('background-color') !== 'transparent' && $el.css('background-color') !== 'rgba(0, 0, 0, 0)') {
                htmlOutput += `            background-color: ${$el.css('background-color')};\n`;
            }
            
            if ($el.css('font-size')) {
                htmlOutput += `            font-size: ${$el.css('font-size')};\n`;
            }
            
            htmlOutput += `        }\n`;
        });
        
        htmlOutput += '    </style>\n</head>\n<body>\n';
        htmlOutput += '    <div class="container">\n';
        
        // Tạo HTML cho từng phần tử
        $('.canvas-item').each(function() {
            const $el = $(this);
            const id = $el.attr('id');
            const type = $el.data('type');
            
            // Tạo HTML dựa trên loại phần tử
            switch(type) {
                case 'heading':
                    const headingText = $el.find('h2').text();
                    htmlOutput += `        <div id="${id}">\n            <h2>${headingText}</h2>\n        </div>\n`;
                    break;
                case 'paragraph':
                    const paragraphText = $el.find('p').text();
                    htmlOutput += `        <div id="${id}">\n            <p>${paragraphText}</p>\n        </div>\n`;
                    break;
                case 'button':
                    const buttonText = $el.find('button').text();
                    htmlOutput += `        <div id="${id}">\n            <button>${buttonText}</button>\n        </div>\n`;
                    break;
                case 'textbox':
                    const placeholder = $el.find('input').attr('placeholder');
                    htmlOutput += `        <div id="${id}">\n            <input type="text" placeholder="${placeholder}">\n        </div>\n`;
                    break;
                case 'image':
                    const altText = $el.find('div').text();
                    htmlOutput += `        <div id="${id}">\n            <img src="placeholder.jpg" alt="${altText}">\n        </div>\n`;
                    break;
                case 'container':
                    const containerTitle = $el.find('.component-title').text();
                    htmlOutput += `        <div id="${id}">\n            <div class="component-title">${containerTitle}</div>\n        </div>\n`;
                    break;
                default:
                    htmlOutput += `        <div id="${id}">Element Content</div>\n`;
            }
        });
        
        htmlOutput += '    </div>\n</body>\n</html>';
        
        // Hiển thị code HTML (trong thực tế bạn có thể tạo một modal hoặc trang mới)
        alert('Code HTML đã được tạo. Kiểm tra console của trình duyệt.'); 
         alert(htmlOutput);
        console.log(htmlOutput);
    });

      // Hàm lưu dữ liệu form
      function saveFormData() {
        const formData = {
            elements: []
        };

        // Thu thập dữ liệu từ tất cả input fields
        $('.canvas-item').each(function() {
            const $el = $(this);
            const element = {
                id: $el.attr('id'),
                type: $el.data('type'),
                position: {
                    x: parseInt($el.css('left')),
                    y: parseInt($el.css('top')),
                    width: $el.width(),
                    height: $el.height()
                },
                style: {
                    color: $el.css('color'),
                    backgroundColor: $el.css('background-color'),
                    fontSize: $el.css('font-size')
                }
            };

            // Lưu giá trị dựa trên loại phần tử
            switch(element.type) {
                case 'textbox':
                    element.value = $el.find('input').val();
                    element.placeholder = $el.find('input').attr('placeholder');
                    break;
                case 'heading':
                    element.value = $el.find('h2').text();
                    break;
                case 'paragraph':
                    element.value = $el.find('p').text();
                    break;
                case 'button':
                    element.value = $el.find('button').text();
                    break;
            }

            formData.elements.push(element);
        });

        // Lưu vào localStorage
        localStorage.setItem('formDesign', JSON.stringify(formData));
        alert('Form đã được lưu!');
    }

    // Hàm khôi phục dữ liệu form
    function loadFormData() {
        const savedData = localStorage.getItem('formDesign');
        if (!savedData) {
            alert('Không tìm thấy dữ liệu đã lưu!');
            return;
        }

        try {
            // Xóa canvas hiện tại
            $('#canvas').empty();
            
            const formData = JSON.parse(savedData);
            formData.elements.forEach(element => {
                // Tạo lại phần tử với dữ liệu đã lưu
                const newElement = createElementOnCanvas(
                    element.type, 
                    element.position.x, 
                    element.position.y
                );

                // Khôi phục style
                newElement.css({
                    width: element.position.width,
                    height: element.position.height,
                    color: element.style.color,
                    backgroundColor: element.style.backgroundColor,
                    fontSize: element.style.fontSize
                });

                // Khôi phục giá trị
                switch(element.type) {
                    case 'textbox':
                        newElement.find('input')
                            .val(element.value)
                            .attr('placeholder', element.placeholder);
                        break;
                    case 'heading':
                        newElement.find('h2').text(element.value);
                        break;
                    case 'paragraph':
                        newElement.find('p').text(element.value);
                        break;
                    case 'button':
                        newElement.find('button').text(element.value);
                        break;
                }
            });

            alert('Dữ liệu form đã được khôi phục!');
        } catch (error) {
            console.error('Lỗi khi khôi phục dữ liệu:', error);
            alert('Có lỗi xảy ra khi khôi phục dữ liệu!');
        }
    }

    // Thêm nút lưu và khôi phục vào control panel
    $('.control-panel').append(`
        <button id="save-form-data">Lưu Form</button>
        <button id="load-form-data">Khôi phục Form</button>
    `);

    // Gắn sự kiện cho các nút
    $('#save-form-data').click(saveFormData);
    $('#load-form-data').click(loadFormData);
});
