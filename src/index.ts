
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { jwtHelpers } from './utils/jwtHelper';
const prisma = new PrismaClient()
interface IContext {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    userInfo:{
        userId:number | null
        name:string
        email:string
    } | null
}

const main = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });


    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: async ({req}): Promise<IContext> => {
            const userInfo=await jwtHelpers.getUserInfoFromToken(req.headers.authorization as string)
       
            return {
                prisma,
                userInfo
            }
        }
    });

    console.log(`🚀  Server ready at: ${url}`);
}

main();

