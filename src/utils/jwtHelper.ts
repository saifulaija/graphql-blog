import { User } from '@prisma/client'
import jwt, { Secret } from 'jsonwebtoken'
import config from '../config'


const generateToken = async (payload: User, secret: Secret) => {
    const token = jwt.sign({ userId: payload.id, name: payload.name, email: payload.email }, secret, { expiresIn: '1d' }

    )

    return token
}

const getUserInfoFromToken=async(token:string)=>{
    try {

        const userData=jwt.verify(token,config.jwt.secret as string) as{
            userId:number
            name:string
            email:string
        }
       
        return userData
        
    } catch (err:any) {
       return null 
    }
}

export const jwtHelpers = {
    generateToken,
    getUserInfoFromToken
}