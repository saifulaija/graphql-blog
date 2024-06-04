import { User } from '@prisma/client'
import jwt, { Secret } from 'jsonwebtoken'


export const jwtHelpers=async(payload:User,secret:Secret)=>{
    const token= jwt.sign({userId:payload.id,name:payload.name,email:payload.email},secret,{expiresIn:'1d'}

    )

    return token
}