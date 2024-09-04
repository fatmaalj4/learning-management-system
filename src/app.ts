import express from 'express';
import ExpressSession from 'express-session';
import logger from 'morgan';
import flash from 'express-flash-plus';

import {apiservice} from './apiService';
import { signinRoutes } from './routes/signinRouter';
import { coursRoutes } from './routes/coursRouter';
import { Enseignant } from './core/enseignant';
import { apiRouter } from './routes/apiRouter';
import { devoirRoutes } from './routes/DevoirRouter';
import { userController } from './core/userController';
import { questionRoutes } from './routes/QuestionRouter';

const titreBase = 'Moodle ETS';
// Creates and configures an ExpressJS web server.
class App {

  
  // ref to Express instance
  public expressApp: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.expressApp = express();
    this.middleware();
    this.routes();
    this.expressApp.set('view engine', 'pug');
    this.expressApp.use(express.static(__dirname + '/public') as express.RequestHandler); // https://expressjs.com/en/starter/static-files.html
  } 

  // Configure Express middleware.
  private middleware(): void {
    this.expressApp.use(logger('dev') as express.RequestHandler);
    this.expressApp.use(express.json() as express.RequestHandler);
    this.expressApp.use(express.urlencoded({ extended: false }) as express.RequestHandler);
    this.expressApp.use(ExpressSession(
      {
        secret: 'My Secret Key',
        resave: false,
        saveUninitialized: true
      }));
    this.expressApp.use(flash());
  }

  // Configure API endpoints.
  private routes(): void {
    
    let router = express.Router();
    // Le squelette ne traite pas la gestion des connexions d'utilisateur, mais
    // les gabarits Pug (navbar) supportent l'affichage selon l'état de connexion 
    // dans l'objet user, qui peut avoir deux valeurs (p.ex. admin ou normal)
    var user = { nom: "anonyme", isAnonymous: true };
    var Teacher:Enseignant;
    //var enseignantSigned = false;
    var email
    // Si l'utilisateur est connecté, le gabarit Pug peut afficher des options, 
    // le nom de l'utilisateur et une option pour se déconnecter.
    
    // Si user.isAnonymous est vrai, le gabarit Pug affiche une option pour se connecter.
    // user = { isAnonymous: true }; // utilisateur quand personne n'est connecté

    // Route pour jouer (index)
    router.get('/', (req, res, next) => {
      res.render('signin', {
        title: titreBase
      })
    });

    router.post('/signin', (req, res, next) => {
      email = req.body.email;
      console.log("Searching for "+email); 
      
      //Invoquer l'opération système (du DSS) dans le contrôleur GRASP
      for(let teacher of apiservice.teacherLogin){

        if(email === teacher[2] && email !==undefined){
          let Teacher = new Enseignant(teacher[0],teacher[1],teacher[2],teacher[3]);
          user = {nom:Teacher.prenom+ " " +Teacher.nom, isAnonymous: false };
          userController.Enseignants.push(Teacher);

          res.redirect('/token='+teacher[3])

          return;
        }
      }
      req.flash('error',"ce courriel n'est pas dans la base de donnees");
      
    });



    router.get('/token=:token', (req, res, next) => {
      const token = req.params.token;
      console.log(token);

      
      let e = userController.Enseignants.filter(enseignant => enseignant.token === token);
      console.log(e);
      if(e.length === 1){
        user = {nom:e[0].prenom+ " " +e[0].nom, isAnonymous: false };
        //enseignantSigned = true;
        this.renderIndex(res,user,e[0]);

      }else{

        for(let teacher of apiservice.teacherLogin){
          if(token === teacher[3]){
            this.addUserAndLogin(res,user,teacher);
            return;
          }
        }
        
        req.flash('error',"token invalide.");
        res.redirect('/');

      }


    });
    
    this.expressApp.use('/', router);  // routage de base
    this.expressApp.use('/token=:token/cours', coursRoutes.router);
    this.expressApp.use('/token=:token/devoirs', devoirRoutes.router);
    this.expressApp.use('/token=:token/questions',questionRoutes.router);
    
  }

  private addUserAndLogin(res,user,teacher){
    let Teacher = new Enseignant(teacher[0],teacher[1],teacher[2],teacher[3]);
    user = {nom:Teacher.prenom+ " " +Teacher.nom, isAnonymous: false };
    userController.Enseignants.push(Teacher);
    
    this.renderIndex(res,user,Teacher);
  }

  private renderIndex(res,user,teacher){
    res.render('index',
      // passer objet au gabarit (template) Pug
      {
        title: titreBase,
        user: user,
        token:teacher.token,
        email:teacher.email,
        coursSGB : JSON.parse(JSON.stringify(apiservice.cours)),
        cours : JSON.parse(JSON.stringify(teacher.cours))
      });
  }

}

export default new App().expressApp;
