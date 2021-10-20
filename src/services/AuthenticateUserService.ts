/*
receber o código por string;
recuperar o access_token no github (acesso as infos do usuário);
recuperar as infos do user tb
verificar se o usuário existe no banco de dados
if = gerar token
else = criar no BD e gerar token
return = token com infos do user logado

quando pega a api do github, vem mta informação desnecessária para essa app, então tem q fazer um filtro apenas com as infos que queremos
*/
import axios from 'axios';
import prismaClient from '../prisma';
import { sign } from 'jsonwebtoken';

interface IAccessTokenResponse{
  access_token: string,
}

interface IUserResponse{
  avatar_url: string,
  login: string,
  id: number,
  name: string,
}

class AuthenticateUserService {
  async execute(code: string){
    const url = "https://github.com/login/oauth/access_token";

    const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers:{
        "Accept": "application/json"
      },
    });

    const response = await axios.get<IUserResponse>("https://api.github.com/user", {
      headers:{
        authorization: `Bearer ${accessTokenResponse.access_token}`
      }
    })

    const { login, id, avatar_url, name } = response.data;

    let user = await prismaClient.user.findFirst({
      where:{
        github_id: id,
      }
    }) 
    
    if (!user){
      await prismaClient.user.create({
        data:{
          github_id: id,
          login,
          avatar_url,
          name
        }
      })
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_ur: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return { token, user };
  }
}
export {AuthenticateUserService}