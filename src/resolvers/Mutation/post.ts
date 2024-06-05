export const postResolvers={
    addPost:async(parent:any,{post}:any,{prisma,userInfo}:any)=>{
        if(!userInfo){
         return{
           userError:"UnAuthorized",
           post:null
         }
        };
   
        if(!post.title || !post.content){
         return{
           userError:"Title & content is required",
           post:null
         }
        };
   
       const newPost = await prisma.post.create({
         data:{
           title:post.title,
           content:post.content,
           authorId:userInfo.userId
         }
       });
      return{
       userError:null,
       post:newPost
      }
       },
       updatePost:async (parent:any,args:any,{prisma,userInfo}:any)=>{
        console.log('args',args,'userInfo',userInfo)
       }
}