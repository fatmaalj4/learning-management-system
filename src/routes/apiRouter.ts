import { Router, Request, Response, NextFunction } from 'express';
import { apiservice } from '../apiService';
import { Enseignant } from '../core/enseignant';
import { userController } from '../core/userController';
export class ApiRouter {
  private _router: Router;
  private titreBase:string = 'Moodle ETS';
  get router() {
      return this._router;
  }
  constructor() {
      this._router = Router();
      this.init();
  }
  public async signin(req: Request, res: Response, next: NextFunction) {
    var email = req.body.email;
    //console.log(req.body);
    //Invoquer l'opération système (du DSS) dans le contrôleur GRASP
    for(let teacher of apiservice.teacherLogin){
      if(email === teacher[2] && email !==undefined){
        res.redirect('/api/v1/token='+teacher[3]);  //res.post('/api/v1/token='+teacher[3]);
      }
    }
  }
  public async tokenAutentification(req: Request, res: Response, next: NextFunction) {
      const token = req.params.token;
      var enseignantSigned = false;
      var Teacher; 
      let user;
      for(let enseignant of userController.Enseignants){
        if(enseignant.token === token){
          Teacher = enseignant;
          user = {nom:Teacher.prenom+ " " +Teacher.nom,Enseignant, isAnonymous: false };
          enseignantSigned = true;
          break;
        }
      }
      if(!enseignantSigned){
        for(let teacher of apiservice.teacherLogin){
          if(token === teacher[3]){
            Teacher = new Enseignant(teacher[0],teacher[1],teacher[2],teacher[3]);
            user = {nom:Teacher.prenom+ " " +Teacher.nom,Teacher, isAnonymous: false };
            userController.Enseignants.push(Teacher);
            break;
          }
        }
      }
      res.render('index',
        // passer objet au gabarit (template) Pug
        {
          title: `${this.titreBase}`,
          user: user,
          token:Teacher.token,
          coursSGB : JSON.parse(JSON.stringify(apiservice.cours)),
          cours : JSON.parse(JSON.stringify(Teacher.cours))
        }); 
  }
  private _errorCode500(error: any, req: Request, res: Response<any, Record<string, any>>) {
    req.flash('error', error.message);
    res.status(error.code).json({ error: error.toString() });
  }
  init() {
    
    this._router.post('/signin', this.signin.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
    this._router.get('/token=:token', this.tokenAutentification.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
  }
  
}
export const apiRouter = new ApiRouter();
apiRouter.init();