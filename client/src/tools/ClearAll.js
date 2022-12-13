import canvasState from "../store/canvasState";
import Tool from "./Tool";

export default class ClearAll extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'clearAll',
            }
        }))
    }
    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    static draw(ctx) {
        ctx.clearRect(0, 0, canvasState.canvas.width, canvasState.canvas.height)
    }
}