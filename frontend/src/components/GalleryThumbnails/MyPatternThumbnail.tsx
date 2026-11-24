import ReadOnlyCanvas from "@components/ReadOnlyCanvas"
import type { ShortPattern } from "@interfaces/pattern"
import "./GalleryThumbnails.css"
import { useNavigate } from "react-router"


const MyPatternThumbnail = ({pattern, onDelete, onCopy}: {pattern: ShortPattern, onDelete: (id: string)=>void, onCopy: (id: string)=>void})=>{

    const nav=useNavigate()

    const onClickDelete=()=>{
        if(pattern._id!==undefined) onDelete(pattern._id)
    }

    const onClickCopy=()=>{
        if(pattern._id!==undefined) onCopy(pattern._id)
    }
    const onClickEdit=()=>{
        if(pattern._id!==undefined) nav("/edytor/"+pattern._id)
    }
    const onClickOpen=()=>{
        if(pattern._id!==undefined) nav("/galeria/"+pattern._id)
    }

    return (<div className="col-5 col-md-3 col-lg-2"><div className="PatternThumbnail">
        <ReadOnlyCanvas pattern={pattern}/>
        <p className="title">{pattern.title}</p>
        <span>{pattern.isPublic ? "Publiczny":"Prywatny"}</span>
        <span>&#9734;{pattern.rating}</span>
        <p><button onClick={onClickOpen}>Otwórz</button><button onClick={onClickEdit}>Edytuj</button><button onClick={onClickCopy}>Kopiuj</button><button onClick={onClickDelete}>Usuń</button></p>
    </div></div>)
}

export default MyPatternThumbnail