import Brush from "./Brush";

export default class Eraser extends Brush {
    constructor(canvas, socket, id){
        super(canvas, socket, id)
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }


    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'erase',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    lineWidth: this.ctx.lineWidth
                }
            }))
        }
    }
    
    static draw(ctx, x, y, lineWidth) {
        ctx.strokeStyle = "white"
        ctx.fillStyle = "white"
        ctx.lineWidth = lineWidth
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}