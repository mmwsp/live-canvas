import Tool from "./Tool";
import canvasState from "../store/canvasState";

export default class Circle extends Tool {
    constructor(canvas, socket, id){
        super(canvas, socket, id)
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e){
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            username: canvasState.username,
            figure: {
                type: 'circle',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                color: this.ctx.fillStyle,
                strokeColor: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))
    }

    mouseDownHandler(e){
        this.mouseDown = true
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e){
        if (this.mouseDown) {
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;
            this.width = this.currentX - this.startX;
            this.height = this.currentY - this.startY;
            let r = Math.sqrt(this.width**2 + this.height**2)
            this.draw(this.startX, this.startY, r)
        }
    }

    draw(x, y, r) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, r, 0, 2*Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx, x, y, w, h, color, strokeColor, lineWidth) {
        ctx.fillStyle = color
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        let r = Math.sqrt(w**2 + h**2)
        ctx.arc(x, y, r, 0, 2*Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

    }
}