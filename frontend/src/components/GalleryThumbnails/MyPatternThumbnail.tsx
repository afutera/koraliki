import ReadOnlyCanvas from "@components/ReadOnlyCanvas"
import type { ShortPattern } from "@interfaces/pattern"
import "./GalleryThumbnails.css"


const MyPatternThumbnail = ({pattern, onDelete, onCopy, onEdit}: {pattern: ShortPattern, onDelete: (id: string)=>void, onCopy: (id: string)=>void, onEdit: (id: string)=>void})=>{

    const onClickDelete=()=>{
        if(pattern._id!==undefined) onDelete(pattern._id)
    }

    const onClickCopy=()=>{
        if(pattern._id!==undefined) onCopy(pattern._id)
    }
    const onClickEdit=()=>{
        if(pattern._id!==undefined) onEdit(pattern._id)
    }

    return (<div className="PatternThumbnail">
        <ReadOnlyCanvas pattern={pattern}/>
        <p className="title">{pattern.title}</p>
        <span>{pattern.isPublic ? "Publiczny":"Prywatny"}</span>
        <span>&#9734;{pattern.rating}</span>
        <p><button>Otwórz</button><button onClick={onClickEdit}>Edytuj</button><button onClick={onClickCopy}>Kopiuj</button><button onClick={onClickDelete}>Usuń</button></p>
    </div>)
}

export default MyPatternThumbnail