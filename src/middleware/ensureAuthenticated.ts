import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken'


//verificar se o token for inválido, retornar um erro
//se o usuário estiver autenticado, passar pra frente

interface IPayload{
  sub: string
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction){
  const authToken = request.headers.authorization;

  if(!authToken){
    return response.status(401).json({
      errorCode: "token.invalid",
    });
  }

  //Bearer <token>
  //[0] bearer
  //[1] token
  const [,token] = authToken.split(" ")

  try{

    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload

    request.user_id = sub;

    return next();

  } catch(err){
    return response.status(401).json({
      errorCode: "toke.expired"
    })
  }

}