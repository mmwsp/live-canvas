import React from "react";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import '../styles/toolbar.scss';
import Brush from "../tools/Brush";
import Circle from "../tools/Circle";
import ClearAll from "../tools/ClearAll";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import Rect from "../tools/Rect";


const Toolbar = () => {

    const changeColor = e => {
        toolState.setFillColor(e.target.value)
        toolState.setStrokeColor(e.target.value)

    }

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL()
        console.log(dataUrl)
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = canvasState.sessionId + '.jpg'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return(
        <div className="toolbar">
            <button className="toolbar__btn brush" onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))} />
            <button className="toolbar__btn rect" onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className="toolbar__btn circle" onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className="toolbar__btn eraser" onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className="toolbar__btn line" onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <input onChange={e => changeColor(e)} style={{marginLeft: 10}} type="color"/>
            <button className="toolbar__btn clear" onClick={() => toolState.setTool(new ClearAll(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className="toolbar__btn undo" onClick={() => canvasState.undo()}/>
            <button className="toolbar__btn redo" onClick={() => canvasState.redo()}/>
            <button className="toolbar__btn save" onClick={() => download()}/>
        </div>
    );
};

export default Toolbar;