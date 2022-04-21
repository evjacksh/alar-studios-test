const canvas = document.querySelector('.canvas')
const canvas_mini = document.querySelector('.canvas-mini')
const color_arr = ['red','blue','green','yellow','black']

if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    function strokeStar(x, y, r, n, inset, color) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.moveTo(0,0-r);
        for (var i = 0; i < n; i++) {
            ctx.rotate(Math.PI / n);
            ctx.lineTo(0, 0 - (r*inset));
            ctx.rotate(Math.PI / n);
            ctx.lineTo(0, 0 - r);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    canvas.addEventListener('click', e => {
        let x = e.offsetX || e.originalEvent.layerX || e.layerX,
            y = e.offsetY || e.originalEvent.layerY || e.layerY,
            pixel = ctx.getImageData(x, y, 1, 1);
            canvas_mini.style.backgroundColor = ctx.fillStyle =  `rgba(${pixel.data[0]},${pixel.data[1]},${pixel.data[2]},${pixel.data[3]})`
    })

    color_arr.forEach((color,i) => strokeStar(60 + (i * 120),60,25,5,2,color))
}

