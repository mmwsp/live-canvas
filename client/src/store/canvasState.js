import { action, makeAutoObservable } from "mobx";

class CanvasState {
    canvas = null

    socket = null
    sessionId = null
    paths = {}
    usersConnected = 0

    isModal = true
    undoList = []
    redoList = []
    username = ""

    constructor(){
        makeAutoObservable(this)
    }

    updateUsersConnected(newValue) {
        this.usersConnected = newValue;
    }

    pushToUndo(data) {
        this.undoList.push(data)
    }

    pushToRedo(data) {
        this.redoList.push(data)
    }

    setSessionId(id) {
        this.sessionId = id
    }

    setSocket(socket) {
        this.socket = socket
    }

    setUsername(username) {
        this.username = username
    }

    setCanvas(canvas) {
        this.canvas = canvas
    }

    undo() {
        let ctx = this.canvas.getContext("2d")
        if(this.undoList.length > 0) {
            let dataUrl = this.undoList.pop()
            this.redoList.push(this.canvas.toDataURL())
            let img = new Image()
            img.src = dataUrl
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }

            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.sessionId,
                figure: {
                    type: 'undo',
                    src: dataUrl
                }
            }))
        }
        else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    } 

    redo() {
        let ctx = this.canvas.getContext("2d")
        if(this.redoList.length > 0) {
            let img = new Image()
            let dataUrl = this.redoList.pop()
            this.undoList.push(this.canvas.toDataURL())
            img.src = dataUrl
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
            
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.sessionId,
                figure: {
                    type: 'redo',
                    src: dataUrl
                }
            }))
        }
        
    }
}

export default new CanvasState();