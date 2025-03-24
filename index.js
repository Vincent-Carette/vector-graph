let graph = document.querySelector(".graph")
let ctx = graph.getContext("2d")
let size = 10
let objects = []
let matrices = {}

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

document.onkeydown = function(e) {
    if (document.activeElement.tagName != "INPUT" && e.key == "/") {
        e.preventDefault()
        document.getElementById("rows").focus()
    }
    if ((document.activeElement.id == "rows" || document.activeElement.id == "columns") && !parseInt(e.key)) {
        if (document.activeElement.id == "columns" && e.key == "Enter") {
            document.getElementById("rows").value = clamp(parseInt(document.getElementById("rows").value), 1, 6)
            document.getElementById("columns").value = clamp(parseInt(document.getElementById("columns").value), 1, 6)

            let rowsVal = parseInt(document.getElementById("rows").value)
            let columnsVal = parseInt(document.getElementById("columns").value)
            let newWrapper = document.createElement("div")
            newWrapper.classList.add("matrixWrapper")
            let newMatrixElem = document.createElement("div")

            document.getElementById("rows").value = ""
            document.getElementById("columns").value = ""

            newMatrixElem.classList.add("matrix")
            newWrapper.appendChild(newMatrixElem)
            document.querySelector(".matrices").appendChild(newWrapper)
            let newMatrix = new Matrix(rowsVal, columnsVal)
            newMatrixElem.style = `grid-template-columns: repeat(${columnsVal}, 0fr);`
            matrices[newMatrixElem] = [newMatrix, []]
            let newVec

            for (let i = 0; i < rowsVal * columnsVal; i++) {
                let newMatrixVal = document.createElement("input")
                newMatrixVal.placeholder = "0"
                newMatrixVal.autocomplete = "off"
                newMatrixVal.type = "text"
                newMatrixVal.classList.add("matrixVal")
                newMatrixVal.onkeydown = function() {
                    setTimeout(function() {
                        matrices[newMatrixElem][1][i] = newMatrixVal.value
                        newMatrix.addValues(parseDataSet(matrices[newMatrixElem][1]))
                        if (rowsVal == 2 && columnsVal == 1) {
                            newVec.pos = [newMatrix.values[0], newMatrix.values[1]]
                            redraw()
                        }
                    }, 1)
                }
                newMatrixElem.appendChild(newMatrixVal)
                if (columnsVal > 4) {
                    newMatrixVal.style.width = "1vw"
                    newMatrixVal.style.height = "1.5vh"
                }
                matrices[newMatrixElem][1].push("0")
            }
            if (rowsVal == 2 && columnsVal == 1) {
                newVec = plotVector(newMatrix.values)
                objects.push(newVec)
                redraw()
            }
        }
        if (e.key != "Backspace" && e.key != "Enter" && e.key != "Tab" && e.key != "0") {
            e.preventDefault()
        }
        if (document.activeElement.id == "rows" && e.key == "Enter") {
            document.getElementById("columns").focus()
            e.preventDefault()
        }
    }
}