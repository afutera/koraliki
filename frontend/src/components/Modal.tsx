
export type ModalArgs={
    title: string, text: string, id: string
    onConfirm: ()=>void,
    onClose: ()=>void,
    getToggle?: (toggle: ModalControl)=>void //przekazuje rodzicowi obiekt pozwalający otwierać/zamykać modal w JS
}

export class ModalControl{
  modal: bootstrap.Modal;
  constructor(id: string){
      this.modal=new bootstrap.Modal((document.getElementById(id)))
  }
  show(){ this.modal.show()}
  close() {this.modal.close()}
  toggle() {this.modal.toggle()}

  //czasem tlo sie nie zamyka, jesli react-router nawiguje na zamknieciu
  forceClose(){
        this.modal.hide()
        document.body?.classList.remove("modal-open")
        document.getElementsByClassName("modal-backdrop")?.item(0)?.remove();
  }
  forceToggle(){
    if(this.modal._isShown) this.show()
    else this.forceClose()
  }
}


import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min"
import { useEffect } from "react"

const Modal=(props:ModalArgs)=>{

    useEffect(()=>{
      if(props.getToggle!=undefined){
        props.getToggle(new ModalControl(props.id))
      }
    },[])
    
    return(<div className="modal fade" tabIndex={-1} aria-labelledby="modaltitle" id={props.id}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="modaltitle">{props.title}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Anuluj" onClick={props.onClose}></button>
      </div>
      <div className="modal-body">
        <p>{props.text}</p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={props.onClose}>Anuluj</button>
        <button type="button" className="btn btn-primary" onClick={props.onConfirm}>Potwierdź</button>
      </div>
    </div>
  </div>
</div>)
}


export default Modal