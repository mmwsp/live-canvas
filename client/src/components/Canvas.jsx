import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import "../styles/canvas.scss";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from "react-router-dom";
import axios from 'axios'
import Circle from "../tools/Circle";
import ClearAll from "../tools/ClearAll";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";
import Notification from "./Notification";

const Canvas = observer(() => {

    const [modal, setModal] = useState(true)
    const [connection, setConnection] = useState(false)
    const [notificationActive, setNotificationActive] = useState(false)
    const [user, setUser] = useState("")
    const usernameRef = useRef()
    const params = useParams()
    const canvasRef = useRef()
      

    //for tracking users who leaved the session
    useEffect(() => {
        const handleTabClose = event => {
            canvasState.socket.send(JSON.stringify({
                id:params.id,
                username: canvasState.username,
                method: "leave"
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
        axios.get(`http://${process.env.REACT_APP_ADRESS}/image?id=${params.id}`)
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
            const socket = new WebSocket(`ws://${process.env.REACT_APP_ADRESS}/`);
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))

            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id:params.id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }

            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                switch (msg.method) {
                    case "connection":
                        setConnection(true)
                        setUser(msg.username)
                        setNotificationActive(true)
                        setTimeout(() => {
                        setNotificationActive(false);
                        }, 5000);
                        break
                    case "leave":
                        setConnection(false)
                        setUser(msg.username)
                        setNotificationActive(true)
                        setTimeout(() => {
                        setNotificationActive(false);
                        }, 5000);
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                }
            }
        }
    }, [canvasState.username])



    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth)
                break
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.strokeColor, figure.lineWidth)
                break
            case "circle":
                Circle.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.strokeColor, figure.lineWidth)
                break
            case "clearAll":
                ClearAll.draw(ctx)
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
            case "erase":
                    Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth)
                break
        }
    } 
    
    const mouseUpHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://${process.env.REACT_APP_ADRESS}/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(response => console.log(response.data))
    }

    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value)
        setModal(false)
    }
    
    const socketRenderUndoRedo = (ctx, dataUrl) => {
        let img = new Image()
        img.src = dataUrl
        img.onload = () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            console.log("write")
            ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)
        }
    }

    return (
        <div className="canvas">
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header >
                    <Modal.Title>Input your username</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectHandler()}>
                        Enter
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseUp={() => mouseUpHandler()} ref={canvasRef} width={1200} height={525}/>
            <Notification active={notificationActive} setActive={setNotificationActive}>
                {connection ? `User ${user} has successfully connected` 
                : `User ${user} has disconnected`}
            </Notification>
        </div> 
    );
});

export default Canvas;