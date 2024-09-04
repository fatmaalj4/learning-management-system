import { Router, Request, Response, NextFunction } from 'express';

import { ControleurCours } from '../core/controleurCours';
//import { Enseignant } from '../core/enseignant';


import { InvalidParameterError } from '../core/errors/invalidParameterError';
import { userController } from '../core/userController';
export class CoursRouter {
    private _router: Router;
  
    get router() {
      return this._router;
    }
  
    /**
     * Initialiser le router
     */
    constructor() {
      this._router = Router();
      this.init();
    }

   /**
   * Ajouter un cours choisi par un enseignant.
   * @function ajouterCours
   * @param {Request} req - La requête HTTP entrante.
   * @param {Response} res - La réponse HTTP sortante.
   * @param {NextFunction} next - Le prochain middleware à appeler.
   * @returns {void}
   * @throws {Error} - Erreur si un ou plusieurs paramètres sont manquants.
   */
    public ajouterCours(req: Request, res: Response, next: NextFunction) {
      const token = req.body.token;
      const cours = req.body.choixCoursSGB;
      let enseignant = userController.findTeacher(req.body.token);

      try {
        // POST ne garantit pas que tous les paramètres de l'opération système sont présents
        enseignant.ajouterCours(cours);
        // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
        req.flash('info', `cours ${cours} ajoute`);
        res.status(200)
          .redirect('/token='+token);
      } catch (error) {
        this._errorCode500(error, req, res);
      }
    }

    /**
     * Supprimer un cours par un enseignant.
     * @function supprimerCours
     * @param {Request} req - La requête HTTP entrante.
     * @param {Response} res - La réponse HTTP sortante.
     * @param {NextFunction} next - Le prochain middleware à appeler.
     * @returns {void}
     * @throws {Error} - Erreur si un ou plusieurs paramètres sont manquants.
     */
    public supprimerCours(req: Request, res: Response, next: NextFunction) {
      const token = req.body.token;
      const nom = req.params.nom;
      console.log(nom);

      console.log(token);
      let enseignant = userController.findTeacher(token);
      console.log(enseignant.nom);
      
      try {
        enseignant.supprimerCours(nom);
        // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
        //this._controleurCours.supprimerCours(nom);
        req.flash('info', `cours ${nom} supprimé`);
        res.status(200)
          .redirect('/token='+token);
      } catch (error) {
        this._errorCode500(error, req, res);
      }

    }
    public displayCourses(req: Request, res: Response) {
      const idCours = req.params.nom;
      const token = req.body.token;
      const nom = req.params.nom;
      console.log(idCours);

      console.log(token);

      let enseignant = userController.findTeacher(token);
      try {

  
          // Invoquer l'opération système (du DSS) dans le contrôleur GRASP.
          const cours = enseignant.chercherCours(idCours);
        
  
          res.status(201)
            .render('detailsCours',{
                  cours: cours,
                  message: 'Success',
                  status: res.status,
              });
      } catch (error) {
        this._errorCode500(error, req, res);
      }
    }

    

    /**
     * Afficher les détails d'un cours sélectionné par l'enseignant.
     * @function detailsCours
     * @param {Request} req - La requête HTTP entrante.
     * @param {Response} res - La réponse HTTP sortante.
     * @returns {void}
     * @throws {Error} - Erreur si le token de l'enseignant est manquant.
     */
    public detailsCours(req: Request, res: Response) {
      const str =req.baseUrl+req.url;
      var matches = str.match(/[0-9a-zA-Z]*/g);
      console.log(matches);
      let token = matches[3]
      let enseignant = userController.findTeacher(token);
      let nom = enseignant.prenom+" "+ enseignant.nom;
      let user = { nom: nom, isAnonymous: false};
      let coursChoisi;

      for(let c of enseignant.cours){
        if(c.id === req.params.cour){
          coursChoisi = c 
          break;
        }
      }
  
      res.status(201)
        .render('detailsCours',
          { 
            user: user,
            cours: coursChoisi,
            token: token,
          });
    }


    private _errorCode500(error: any, req: Request, res: Response<any, Record<string, any>>) {
      req.flash('error', error.message);
      res.status(error.code).redirect('/token='+req.body.token);
    }


    /**
       * Take each handler, and attach to one of the Express.Router's
       * endpoints.
       */
    init() {
      // supprimer cours
      this._router.post('/supprimerCours/:nom', this.supprimerCours.bind(this));

      this._router.post('/displayCourses/:id', this.displayCourses.bind(this));

      this._router.post('/detailsCours/:cour', this.detailsCours.bind(this));

      this._router.post('/ajouterCours', this.ajouterCours.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
    }
  
  }
  
  // exporter its configured Express.Router
  export const coursRoutes = new CoursRouter();
  coursRoutes.init();
  