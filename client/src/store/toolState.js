import { makeAutoObservable } from "mobx";

class ToolState {
    tool = null
    constructor(){
        makeAutoObservable(this)
    }

   setFillColor(color) {
        this.tool.fillColor = color 
    }

    setStrokeColor(color) {
        this.tool.strokeColor = color
    }

    setLineWidth(width) {
        this.tool.lineWidth = width
    }

    setTool(tool) {
        this.tool = tool
    }
}

export default new  ToolState()