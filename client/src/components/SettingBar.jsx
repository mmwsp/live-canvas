import React from "react";
import toolState from "../store/toolState";

const SettingBar = () => {

    return(
        <div className="setting-bar">
           <label htmlFor="line-width">Line size</label>
           <input onChange={e => toolState.setLineWidth(e.target.value)}
           style={{margin: '0 10px', borderRadius: '5px'}} id="line-width" type="number" defaultValue={1} min={1} max={50}/>
           <label htmlFor="stroke-color">Stroke color  </label>
           <input id="stroke-color" style={{margin: '0 10px', borderRadius: '5px'}} onChange={e => toolState.setStrokeColor(e.target.value)} type="color"/> 
        </div>
    );
};

export default SettingBar;