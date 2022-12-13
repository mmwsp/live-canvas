import Tool from "./Tool";


export default class Line extends Tool {
    constructor(canvas, socket, id){
        super(canvas, socket, id)
        this.listen()
        this.name = 'Line'
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.currentX = e.pageX-e.target.offsetLeft
        this.currentY = e.pageY-e.target.offsetTop
        this.ctx.beginPath()
        this.ctx.moveTo(this.currentX, this.currentY )
        this.saved = this.canvas.toDataURL()
    }

    mouseUpHandler(e) {
        //if you want reaction on the both stroke and fill color changes send ctx.strokeStyle
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'line',
                startX: this.startX,
                startY: this.startY,
                endX: this.endX,
                endY: this.endY,
                color: this.ctx.fillStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))
        
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.draw(e.pageX-e.target.offsetLeft, e.pageY-e.target.offsetTop);
        }
    }


    draw(x,y) {
        const img = new Image()
        img.src = this.saved
        img.onload = async function () {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.currentX, this.currentY )
            this.startX = this.currentX
            this.startY = this.currentY
            this.ctx.lineTo(x, y)
            this.endX = x
            this.endY = y
            this.ctx.stroke()
        }.bind(this)

    }

    static staticDraw(ctx, startX, startY, endX, endY, color, lineWidth) {
        ctx.strokeStyle = color  
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
    }
}