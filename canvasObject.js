class CanvasObject {
    constructor(type, pos, startPos) {
        this.type = type
        this.pos = pos
        this.startPos = startPos
        this.removed = false
    }

    draw(context) {
        if (this.removed) {return}
        if (this.type == "text") {
            context.fillText(this.startPos, this.pos[0], this.pos[1])
        } else if (this.type == "vector") {
            // plotVector(this.pos[0], this.pos[1])
            let pos = [
                width / size * this.pos[0] / 2 + width / 2,
                height / -size * this.pos[1] / 2 + height / 2
            ]
            canvas_arrow(ctx, width / 2, height / 2, pos[0], pos[1])
        } else if (this.type == "line") {
            context.moveTo(this.startPos[0], this.startPos[1])
            context.lineTo(this.pos[0], this.pos[1])
            context.stroke()
        }
    }
    remove() {
        this.removed = true
    }
}