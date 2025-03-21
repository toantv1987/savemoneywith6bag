function previewWeb() {
    // Tạo cửa sổ preview
    const previewWindow = window.open('', 'Preview Web', 'width=1024,height=768');
    
    // Thu thập HTML từ canvas
    let previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Web Preview</title>
            <style>
                body { margin: 0; padding: 20px; }
                .preview-container { max-width: 1200px; margin: 0 auto; }
            </style>
        </head>
        <body>
            <div class="preview-container">
    `;

    // Sao chép các phần tử từ canvas
    $('#canvas .canvas-item').each(function() {
        const $el = $(this);
        const style = {
            position: 'relative',
            left: $el.css('left'),
            top: $el.css('top'),
            width: $el.css('width'),
            height: $el.css('height'),
            backgroundColor: $el.css('background-color'),
            color: $el.css('color'),
            fontSize: $el.css('font-size'),
            margin: '10px 0'
        };
        
        const styleStr = Object.entries(style)
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join(';');

        previewHTML += `<div style="${styleStr}">${$el.html()}</div>`;
    });

    previewHTML += `
            </div>
        </body>
        </html>
    `;

    previewWindow.document.write(previewHTML);
    previewWindow.document.close();
}

function previewMobile() {
    // Tạo cửa sổ preview mobile
    const previewWindow = window.open('', 'Preview Mobile', 'width=375,height=667');
    
    // Thu thập HTML từ canvas với CSS mobile-friendly
    let previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mobile Preview</title>
            <style>
                body { margin: 0; padding: 10px; }
                .preview-container { width: 100%; }
                img { max-width: 100%; height: auto; }
                input, button { width: 100%; box-sizing: border-box; }
            </style>
        </head>
        <body>
            <div class="preview-container">
    `;

    $('#canvas .canvas-item').each(function() {
        const $el = $(this);
        const style = {
            position: 'relative',
            width: '100%',
            backgroundColor: $el.css('background-color'),
            color: $el.css('color'),
            fontSize: $el.css('font-size'),
            margin: '10px 0',
            padding: '5px'
        };
        
        const styleStr = Object.entries(style)
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join(';');

        previewHTML += `<div style="${styleStr}">${$el.html()}</div>`;
    });

    previewHTML += `
            </div>
        </body>
        </html>
    `;

    previewWindow.document.write(previewHTML);
    previewWindow.document.close();
}

function printDesign() {
    // Tạo phiên bản in
    const printWindow = window.open('', '_blank');
    let printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print Preview</title>
            <style>
                @media print {
                    body { margin: 0; }
                    .print-container { padding: 20px; }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
    `;

    $('#canvas .canvas-item').each(function() {
        const $el = $(this);
        printContent += `<div style="margin: 10px 0;">${$el.html()}</div>`;
    });

    printContent += `
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

function exportPDF() {
    // Tạo container cho PDF
    const element = document.createElement('div');
    element.style.padding = '20px';
    
    // Sao chép nội dung từ canvas
    $('#canvas .canvas-item').each(function() {
        const $el = $(this);
        const div = document.createElement('div');
        div.style.margin = '10px 0';
        div.innerHTML = $el.html();
        element.appendChild(div);
    });

    // Cấu hình PDF
    const opt = {
        margin: 1,
        filename: 'design-export.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Tạo PDF
    html2pdf().set(opt).from(element).save();
}

// Gắn các hàm vào sự kiện click
$(document).ready(function() {
    $('#preview-web').click(previewWeb);
    $('#preview-mobile').click(previewMobile);
    $('#print-design').click(printDesign);
    $('#export-pdf').click(exportPDF);
});