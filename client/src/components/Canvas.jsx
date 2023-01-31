import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import "../styles/canvas.scss";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import { useParams } from "react-router-dom";
import axios from 'axios'
import Circle from "../tools/Circle";
import ClearAll from "../tools/ClearAll";
import Line from "../tools/Line";
import Notification from "./Notification";
import ModalWindow from "./ModalWindow";


const Canvas = observer(() => {

    const [connection, setConnection] = useState(false)
    const [notificationActive, setNotificationActive] = useState(false)
    const [socketClosed, setSocketClosed] = useState(false)
    const [user, setUser] = useState("")
    const params = useParams()
    const canvasRef = useRef()


    //for tracking users who leaved the session
    useEffect(() => {
        const handleTabClose = event => {
            canvasState.socket.send(JSON.stringify({
                id:params.id,
                username: canvasState.username,
                method: "leave",
            }))
        };
        window.addEventListener('beforeunload', handleTabClose);
        return () => {
          window.removeEventListener('beforeunload', handleTabClose);
        };
      }, []);


    //for canvas synchronization at start
    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`https://${process.env.REACT_APP_ADRESS}/image?id=${params.id}`)
        .then(response => {
            const img = new Image()
            img.src = response.data
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
            }
        }) 

    }, [])


    //for creating connection and message handle
    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket(`wss://${process.env.REACT_APP_ADRESS}/`);
            setSocketClosed(false)
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))
            toolState.setStrokeColor('black')
            toolState.setLineWidth('1')

            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id:params.id,
                    username: canvasState.username,
                    method: "connection",
                }))
            }

            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                switch (msg.method) {
                    case "connection":
                        setConnection(true)
                        setUser(msg.username)
                        canvasState.updateUsersConnected(msg.users)
                        setNotificationActive(true)
                        setTimeout(() => {
                        setNotificationActive(false);
                        }, 5000);
                        break
                    case "leave":
                        setConnection(false)
                        setUser(msg.username)
                        canvasState.updateUsersConnected(msg.users)
                        setNotificationActive(true)
                        setTimeout(() => {
                        setNotificationActive(false);
                        }, 5000);
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                    case "set-background":
                        setBackground(msg.data)
                        break
                }
            }
            socket.onclose = () => {
                setSocketClosed(true)
            }
        }
    }, [canvasState.username])


    const drawHandler = (msg) => {
        const figure = msg.figure
        const username = msg.username

        const ctx = canvasRef.current.getContext('2d')

        switch (figure.type) {
            case "start-brush" :
                Brush.startDraw(ctx, figure.x, figure.y, figure.color, figure.lineWidth, username)
                break
            case "brush":
                Brush.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth, username)
                break
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.strokeColor, figure.lineWidth)
                break
            case "circle":
                Circle.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.strokeColor, figure.lineWidth)
                break
            case "clearAll":
                ClearAll.draw(ctx)
                Object.keys(canvasState.paths).forEach(function(key) {
                    delete canvasState.paths[key];
                  });                  
                break
            case "line":
                Line.staticDraw(ctx, figure.startX, figure.startY, figure.endX, figure.endY, figure.color, figure.lineWidth)
                break
            case "finish":
                ctx.beginPath()
                break
            case "undo":
                socketRenderUndoRedo(ctx, figure.src)
                break
            case "redo":
                socketRenderUndoRedo(ctx, figure.src)
                break
        }

    } 
    
    
    const mouseUpHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`https://${process.env.REACT_APP_ADRESS}/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
        .catch(err => console.log(err))
    }

    
    const socketRenderUndoRedo = (ctx, dataUrl) => {
        let img = new Image()
        img.src = dataUrl
        img.onload = () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)
        }
    }

    const setBackground = (data) => {
        const ctx = canvasRef.current.getContext('2d')
        const img = new Image()
        img.src = data
        img.onload = () => {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
        }
    }

    return (
        <div className="canvas">
            <ModalWindow/>
            <canvas onMouseUp={() => mouseUpHandler()} ref={canvasRef} width={1000} height={650}/>

            <Notification active={notificationActive} setActive={setNotificationActive}>
                {connection ? `User ${user} has successfully connected` 
                : `User ${user} has disconnected`}
            </Notification>

            <Notification active={socketClosed} setActive={setSocketClosed}>
                {socketClosed ? `You were disconnected due to inactivity. Please reload the page if you are still here.` : null}
            </Notification>
        </div> 
    );
});

export default Canvas;