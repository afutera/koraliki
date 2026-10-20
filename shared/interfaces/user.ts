export interface SharedPublicUser<IdType>{
    _id?: IdType,
    username: string,
    description: string,
    createdAt: Date,
    favouritePatterns: Array<IdType>,
}

export interface SharedPrivateUser<IdType> extends SharedPublicUser<IdType>{
    email: string,
    password: string,
    isAdmin: boolean,
    isMainAdmin? : boolean,
}

export interface SharedJwtUser<IdType>{
    _id: IdType,
    username: string,
    isAdmin: boolean,
    isMainAdmin : boolean
}