import { makeAutoObservable } from "mobx";

class ToolState {
    tool = null
    currentColor = null
    currentWidth = null
    constructor(){
        makeAutoObservable(this)
    }

   setFillColor(color) {
        this.tool.fillColor = color 
    }

    setStrokeColor(color) {
        this.tool.strokeColor = color
        this.currentColor = color
    }

    setLineWidth(width) {
        this.tool.lineWidth = width
        this.currentWidth = width
    }

    setTool(tool) {
        this.tool = tool
    }
}

export default new  ToolState()