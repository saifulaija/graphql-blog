
import { prisma } from "../shared/prisma"
import  bcrypt from 'bcrypt'

import { jwtHelpers } from "../utils/jwtHelper";
import config from "../config";

interface IUserInfo{name:string, email:string,password:string,bio?:string}
interface ISignInfo{email:string,password:string}



export const resolvers = {
    Query: {
      users:async(parent:any,args:any,context:any)=>{
      return await  prisma.user.findMany();
     
      }
    },

    Mutation:{
      signup:async(parent:any,args:IUserInfo,context:any)=>{
        const isExist=await prisma.user.findFirst({
          where:{
            email:args.email
          }
        });

        if(isExist){
          return{
            userError:'This email is already registered'
          }
        }

        const hashedPassword=await bcrypt.hash(args.password, 12);
      
        const newUser= await prisma.user.create({
          data:{
            name:args.name,
            email:args.email,
            password:hashedPassword
          }
        });

        if(args.bio){
          await prisma.profile.create({
            data:{
              bio:args.bio,
              userId:newUser.id,

            }
          })
        }

        const token= await jwtHelpers(newUser,config.jwt.secret as string)
       return {
        userError:null,
        token
       }

      },
      signin:async(parent:any,args:ISignInfo,context:any)=>{
        const user= await prisma.user.findFirst({
          where:{
            email:args.email
          }
        });

        if(!user){
          return{
            userError:"user not found",
            token:null
          }
        }

        const correctPassword= await bcrypt.compare(args.password, user.password)
        if(!correctPassword){
          return {
            userError:"Incorrect password",
            token:null
          }
        }

        const token= await jwtHelpers(user,config.jwt.secret as string)
        return {
          userError:null,
          token
        }
        console.log(correctPassword)
      }
    }
  }