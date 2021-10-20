import{ Request, Response } from 'express';
import { CreateMessageService } from '../services/CreateMessageService'

class CreateMessageController{
  async handle(request: Request, response: Response){
    //pra criar a mensagem, o usuário precisa estar autenticado
    const { message } = request.body; 
    const { user_id } = request;

    const services = new CreateMessageService();
    const result = await services.execute(message, user_id);

    return response.json(result);
  }
}

export { CreateMessageController };