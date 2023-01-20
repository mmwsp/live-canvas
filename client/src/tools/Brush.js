import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Tool from "./Tool";

export default class Brush extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'finish',
            }
        }))
        
        
    }
    mouseDownHandler(e) {
        this.mouseDown = true
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            username: canvasState.username,
            figure: {
                type: 'start-brush',
                x: e.pageX - e.target.offsetLeft,
                y: e.pageY - e.target.offsetTop,
                color: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))
    }
    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                username: canvasState.username,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    color: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth
                }
            }))

        }
    }

    static draw(ctx, x, y, color, lineWidth, username) {

        canvasState.paths[username].lineTo(x, y);
        if(username !== canvasState.username) {
            ctx.strokeStyle = color
            ctx.lineWidth = lineWidth
        }
        ctx.stroke(canvasState.paths[username]);
        ctx.strokeStyle = toolState.currentColor
        ctx.lineWidth = toolState.currentWidth

    }
    

    static startDraw(ctx, x, y, color, lineWidth, username) {
        canvasState.paths[username] = new Path2D();
        canvasState.paths[username].lineWidth = lineWidth
        canvasState.paths[username].strokeStyle = color
        canvasState.paths[username].moveTo(x, y);
    }
}
