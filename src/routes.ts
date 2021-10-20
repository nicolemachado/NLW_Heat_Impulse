import { Router } from 'express';
import { AuthenticateUserController } from './controllers/AuthenticateUserController';
import { CreateMessageController } from './controllers/CreateMessageController';
import { GetLast3MessagesController } from './controllers/GetLast3MessagesController';
import { ProfileUserController } from './controllers/ProfileUserController';
import { ensureAuthenticated } from './middleware/ensureAuthenticated';

const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle)
//estanciei o controller e chamei o método hanlde que recebe o request e response, porém dentro d rota ele funciona como um mider, sem precisar passar os parâmetros pois o express consegue fazer isso.

router.post("/messages", ensureAuthenticated , new CreateMessageController().handle)

router.get("/messages/last3", new GetLast3MessagesController().handle);

router.get("/profile", ensureAuthenticated, new ProfileUserController().handle);

export { router }