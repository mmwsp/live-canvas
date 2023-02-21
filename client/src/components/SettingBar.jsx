import React, { useContext } from "react";
import { Context } from "..";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import UsersCounter from "./UsersCounter";
import '../styles/toolbar.scss';

const SettingBar = () => {
    const {authState} = useContext(Context)

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg") {
            if (file.size <= 5 * 1024 * 1024) {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64EncodedImage = reader.result;
                    canvasState.socket.send(JSON.stringify({
                        id: canvasState.sessionId,
                        username: canvasState.username,
                        method: "set-background",
                        data: base64EncodedImage
                    }))
                    
                };
                reader.readAsDataURL(file);
            }
            else {
                alert("File is too large. File size must be less than 5 MB.")
            }
        } else {
            alert("Incorrect file type. You must upload only jpeg/jpg/png files.")
        }
    }

    const logoutHandle = () => {
        authState.logout()
        canvasState.socket.send(JSON.stringify({
            id:canvasState.sessionId,
            username: canvasState.username,
            method: "leave",
        }))
    }
    

    return(
        <div className="setting-bar">
            <UsersCounter/>
            <div className="mid-group">
                    <label htmlFor="line-width">Line size</label>
                <input onChange={e => toolState.setLineWidth(e.target.value)}
                style={{margin: '0 10px', borderRadius: '5px'}} id="line-width" type="number" defaultValue={1} min={1} max={50}/>
                    <button className="setting-bar__btn setBack" onClick={() => document.getElementById('fileInput').click()}/>
                <label htmlFor="stroke-color">Stroke color  </label>
                <input id="stroke-color" style={{margin: '0 10px', borderRadius: '5px'}} onChange={e => toolState.setStrokeColor(e.target.value)} type="color"/> 
            </div>
           <input type="file" id="fileInput" onChange={handleFileUpload} style={{display: 'none'}} />
           <button className="setting-bar__btn logout" onClick={() => logoutHandle()}/>
        </div>
    );
};

export default SettingBar;