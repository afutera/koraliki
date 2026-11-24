
export default function ErrorScreen({action,errorMsg, onTryAgain}:{action:string, errorMsg:string, onTryAgain:(()=>void)|(()=>Promise<void>)}){
    return ( <div className="errorBox"><h2>Błąd przy {action}</h2>
        <p>Szczegóły: {errorMsg}</p>
        <button onClick={onTryAgain} className="btn btn-primary">Spróbuj ponownie</button>
        </div>)
}