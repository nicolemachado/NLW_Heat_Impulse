import prismaClient from '../prisma';

class GetLast3MessagesService { 
  async execute() {
   const messages = await prismaClient.message.findMany({
     take:3,
     orderBy:{
       created_at: "desc" //da mais recente para a mais "velha"
     },
     include:{
       user:true,
     }
   })
   // vai pegar tudo de messages mas vai ter limite de 3, sendo da mais recente para a mais antiga dessas 3
   return messages;
  }}
export { GetLast3MessagesService }