type EditorTools = "Pencil" | "Drag" | "Erase" | "Line" | "Fill" | "ZoomIn" | "ZoomOut" | "Save" | "ImgDrag" | "ImgScale" | "ImgDelete"
function isEditorTool(x: any): x is EditorTools {
    if(typeof x !== "string") return false
    return (x==="Pencil" || x==="Drag" || x==="Erase" || x==="Line" || x==="Fill" || x==="ZoomIn" || x==="ZoomOut" || x==="Save" || x==="ImgDrag" || x==="ImgScale" || x==="ImgDelete")
}

type EditorLayers = "Beads" | "Images"

export {type EditorTools, type EditorLayers, isEditorTool}