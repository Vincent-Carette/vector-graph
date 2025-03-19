let graph = document.querySelector(".graph")
let ctx = graph.getContext("2d")
let size = 10
let objects = []

graph.width = window.innerWidth * 0.7
graph.height = window.innerHeight

let width = graph.clientWidth
let height = graph.clientHeight

function redraw() {
    ctx.clearRect(0, 0, graph.width, graph.height)
    ctx.beginPath()
    for (let i = 0; i < objects.length; i++) {
        objects[i].draw(ctx)
    }
}

ctx.lineWidth = 1
ctx.strokeStyle = "#fff"
ctx.moveTo(0, height / 2)
ctx.lineTo(width, height / 2)
ctx.stroke()
objects.push(new CanvasObject("line", [width, height / 2], [0, height / 2]))
ctx.moveTo(width / 2, 0)
ctx.lineTo(width / 2, height)
ctx.stroke()
objects.push(new CanvasObject("line", [width / 2, height], [width / 2, 0]))

function canvas_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 10;
    var dx = tox - fromx
    var dy = toy - fromy
    var angle = Math.atan2(dy, dx)
    context.moveTo(fromx, fromy)
    context.lineTo(tox, toy)
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6))
    context.moveTo(tox, toy)
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6))
    ctx.stroke()
}

function plotVector(vec) {
    let pos = [
        width / size * vec[0] / 2 + width / 2,
        height / -size * vec[1] / 2 + height / 2
    ]
    canvas_arrow(ctx, width / 2, height / 2, pos[0], pos[1])
    let newObj = new CanvasObject("vector", vec)
    return newObj
}

for (let i = 0; i < size * 2 + 1; i++) {
    let pos = width / (size * 2) * i
    ctx.moveTo(pos, height / 2 + 5)
    ctx.lineTo(pos, height / 2 - 5)
    ctx.stroke()
    objects.push(new CanvasObject("line", [pos, height / 2 - 5], [pos, height / 2 + 5]))
    ctx.font = "15px Arial"
    ctx.fillStyle = "#fff"
    if (i - size != 0) {
        ctx.fillText(
            i - size,
            pos - ctx.measureText((i - size).toString(10).replace("-", "--")).width / 2,
            height / 2 + 25
        )
        objects.push(new CanvasObject("text", [
            pos - ctx.measureText((i - size).toString(10).replace("-", "--")).width / 2,
            height / 2 + 25
        ], i - size))
    } else {
        ctx.fillText("0", width / 2 - ctx.measureText("0").width - 10, height / 2 + 25)
        objects.push(new CanvasObject("text", [
            width / 2 - ctx.measureText("0").width - 10,
            height / 2 + 25
        ], "0"))
    }
}

for (let i = 0; i < size * 2 + 1; i++) {
    let pos = height / (size * 2) * i
    ctx.moveTo(width / 2 + 5, pos)
    ctx.lineTo(width / 2 - 5, pos)
    objects.push(new CanvasObject("line", [width / 2 - 5, pos], [width / 2 + 5, pos]))
    ctx.stroke()
    ctx.font = "15px Arial"
    ctx.fillStyle = "#fff"
    if (i - size != 0) {
        ctx.fillText((size * 2 - i) - size, width / 2 + 15, pos + 15/4)
        objects.push(new CanvasObject("text", [
            width / 2 + 15,
            pos + 15 / 4
        ], (size * 2 - i) - size))
    }
}

let i = 0
setInterval(function() {
    if (i > 100) {return}
    let vec = plotVector([i / 100, 3])
    objects.push(vec)
    redraw()
    vec.remove()
    i++
}, 10)