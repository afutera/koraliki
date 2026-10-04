interface BackendError{
    statusCode: number
    message: string
}

function isBackendError(x: any): x is BackendError{
    return (typeof x.statusCode==="number")&&(typeof x.message==="string")
}

export {type BackendError, isBackendError}