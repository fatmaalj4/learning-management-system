import { emptyStatement } from '@babel/types';
import { Router, Request, Response, NextFunction } from 'express';
import { apiservice } from '../apiService';
import { Enseignant } from '../core/enseignant';
import { InvalidParameterError } from '../core/errors/invalidParameterError';


export class signinRouter {

    private _router: Router;

    get router() {
      return this._router;
    }

    constructor() {
      this._router = Router();
      this.init();
    }

    public async signin(req: Request, res: Response, next: NextFunction) {
      let email = req.params.email;
      console.log("sadfffff");
      // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
      if(email.length != 1){
        email = email.substring(0, email.length-1);
      }
      for(let teacher of apiservice.teacherLogin){
        if(email === teacher[2] && email !==undefined){
          return res.redirect('/token='+teacher[3]);
        }
      }
    }
      
    private _errorCode500(error: any, req: Request, res: Response<any, Record<string, any>>) {
      req.flash('error', error.message);
        res.status(error.code).json({ error: error.toString() });
    }
    
    init() {
        
      this._router.get('/signin/:email', this.signin.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342

    }
    
}
export const signinRoutes = new signinRouter();
signinRoutes.init();