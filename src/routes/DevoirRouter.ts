import { NextFunction, Request, Response, Router } from 'express';
import { DevoirController } from '../core/DevoirController';
import { userController } from '../core/userController';

/**
 * Represente un routeur pour gérer les requêtes de Devoirs.
 */
export class DevoirRouter {
  private _router: Router;
  private _devoirController: DevoirController;

  get router() {
    return this._router;
  }

  constructor() {
    this._router = Router();
    this._devoirController = new DevoirController(userController);
    this.init();
  }

  get devoirController() {
    return this._devoirController
  }


  /**
   * Fonction de routage pour selectionner le cours dans lequel créer le devoir.
   * 
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function to call in the middleware chain.
   * 
   * @returns {undefined}
   */ 
  public choixCourPourCreationDevoir(req: Request, res: Response, next: NextFunction) {
    if(req.body.choixCours!== undefined){
      let teacher = userController.findTeacher(req.body.token);
      let coursChoisi;
      for(let cour of teacher.cours){
        if(cour.sigle ===req.body.choixCours){
          coursChoisi = cour
          break;
        } 
      }
    
      let user = {nom:req.body.nom, isAnonymous: false };
    
      res.render('ajouterDevoir', {
        message: 'Success',
        status: res.status,
        title: `Devoir`,
        user: user,
        token: req.body.token,
        cour: coursChoisi,
        cours : JSON.parse(JSON.stringify(teacher.cours))
      });
    }else{
      req.flash('error', `Veuillez choisir un cour`);
      res.redirect('/token='+req.body.token);
    }
    
  }
  

    /**
   * Fonction de routage pour créer le devoir et retourner la page.
   * 
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function to call in the middleware chain.
   * 
   * @returns {undefined}
   */ 
  public creerDevoir(req: Request, res: Response, next: NextFunction) {  
    let enseignant = userController.findTeacher(req.body.token);
    let coursChoisi;
    for(let cour of enseignant.cours){
      if(cour.sigle ===req.body.choixCours){
        coursChoisi = cour
        break;
      }
    }
    let user = {nom:enseignant.prenom+ " "+enseignant.nom, isAnonymous: false };
    try {
      this._devoirController.ajoutDevoir(req.body.nom,req.body.description,req.body.note,new Date(req.body.dateDebut),new Date(req.body.dateFin),req.body.choixCours,req.body.token);
      req.flash('info', `Devoir ajouté`);
      //res.sendStatus(200).redirect('/token='+req.body.token+'/devoirs/choixCourPourCreationDevoir');
      res.render('ajouterDevoir', {
        message: 'Success',
        status: res.status,
        title: `Devoir`,
        user: user,
        token: req.body.token,
        cour: coursChoisi
      });
    } catch (error) {
      req.flash('error', error.message);
      //res.sendStatus(500).redirect('/token='+req.body.token+'/devoirs/choixCourPourCreationDevoir');
      res.render('ajouterDevoir', {
        message: 'Success',
        status: res.status,
        title: `Devoir`,
        user: user,
        token: req.body.token,
        cour: coursChoisi
      });
    } 
  } 

  /**
   * Fonction de routage pour afficher les devoirs.
   * 
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function to call in the middleware chain.
   * 
   * @returns {undefined}
   */ 
  public affichageDevoir(req: Request, res: Response) {
    const str =req.baseUrl+req.url;
    var matches = str.match(/[0-9a-zA-Z]*/g);
    console.log(matches);
    let enseignant = userController.findTeacher(matches[3]);
    let nom = enseignant.prenom+" "+ enseignant.nom;
    let user = { nom: nom, isAnonymous: false};
    let coursChoisi;
    let devoirChoisi;
    for(let cour of enseignant.cours){
      if(cour.sigle ===matches[9]){
        coursChoisi = cour 
        for(let devoir of cour.listeDevoirs){
          if(devoir.nom ===matches[11]){
            devoirChoisi = devoir;
            break;
          }
        }
        break;
      }
    }

    res.status(201)
      .render('affichageDevoirs',
        { 
          user: user,
          cours: coursChoisi,
          devoir: devoirChoisi,
          token: matches[3],
        });
  }


  /**
   * Fonction de routage pour afficher le devoir sélectionné.
   * 
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function to call in the middleware chain.
   * 
   * @returns {undefined}
   */ 
  public detailsDevoir(req: Request, res: Response) {
    const str =req.baseUrl+req.url;
    var matches = str.match(/[0-9a-zA-Z]*/g);
    console.log(matches);
    let enseignant = userController.findTeacher(matches[3]);
    let nom = enseignant.prenom+" "+ enseignant.nom;
    let user = { nom: nom, isAnonymous: false};
    let coursChoisi;
    let devoirChoisi;
    for(let cour of enseignant.cours){
      if(cour.sigle ===matches[9]){
        coursChoisi = cour
        for(let devoir of cour.listeDevoirs){
          if(devoir.nom ===matches[11]){
            devoirChoisi = devoir;
            break;
          }
        }
        break;
      } 
    }

    res.status(201)
      .render('detailsDevoir',
        { 
          user: user,
          cours: coursChoisi,
          listEtudiants : coursChoisi.listeEtudiant,
          devoir: devoirChoisi,
          token: matches[3],
        });
  }



  /**
   * Fonction de routage pour modifier le cours selectionné.
   * 
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function to call in the middleware chain.
   * 
   * @returns {undefined}
   */ 
  public choixCourPourModificationDevoir(req: Request, res: Response, next: NextFunction) {
    const {baseUrl, url} = req;
    const matches = (baseUrl + url).match(/[0-9a-zA-Z]*/g);
    console.log(matches);
    const teacher = userController.findTeacher(matches[3]);
    let coursChoisi, devoirChoisi;
    for (const cours of teacher.cours) {
      if (cours.sigle === matches[9]) {
        coursChoisi = cours;
        for (const devoir of cours.listeDevoirs) {
          if (devoir.nom === matches[11]) {
            devoirChoisi = devoir;
            break;
          }
        }
        break;
      }
    }
    const nom = `${teacher.prenom} ${teacher.nom}`;
    const debut = devoirChoisi.dateDebut.toISOString().substring(0, 10);
    const fin = devoirChoisi.dateFin.toISOString().substring(0, 10);
    const user = {nom, isAnonymous: false };
    res.render('modifierDevoir', {
      message: 'Success',
      status: res.status,
      title: `Devoir`,
      user,
      token: matches[3],
      cour: coursChoisi,
      devoir:devoirChoisi,
      debut,
      fin,
    });
  }


  /**
   * Fonction de routage pour modifier le devoir sélectionné.
   * 
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function to call in the middleware chain.
   * 
   * @returns {undefined}
   */ 
  public modifierDevoir(req: Request, res: Response, next: NextFunction) {
    const teacher = userController.findTeacher(req.body.token);
    let coursChoisi, devoirChoisi;
    for (const cours of teacher.cours) {
      if (cours.sigle === req.body.choixCours) {
        coursChoisi = cours;
        for (const devoir of cours.listeDevoirs) {
          if (devoir.nom === req.body.oldName) {
            devoirChoisi = devoir;
            break;
          }
        }
        break;
      }
    }
    const nom = `${teacher.prenom} ${teacher.nom}`;
    const debut = devoirChoisi.dateDebut.toISOString().substring(0, 10);
    const fin = devoirChoisi.dateFin.toISOString().substring(0, 10);
    const user = {nom, isAnonymous: false };
    try {
      this.devoirController.modifierDevoir(
        req.body.nom,
        req.body.description,
        req.body.note,
        new Date(req.body.dateDebut),
        new Date(req.body.dateFin),
        req.body.choixCours,
        req.body.token,
        req.body.oldName,
      );
      for (const devoir of coursChoisi.listeDevoirs) {
        if (devoir.nom === req.body.nom) {
          devoirChoisi = devoir;
          break;
        }
      }
      const debut = devoirChoisi.dateDebut.toISOString().substring(0, 10);
      const fin = devoirChoisi.dateFin.toISOString().substring(0, 10);
      req.flash('info', `Devoir modifié`);
      res.render('afficherDevoirModifier', {
        message: 'Success',
        status: res.status,
        title: `Devoir`,
        user,
        token: req.body.token,
        cour: coursChoisi,
        devoir:devoirChoisi,
        debut,
        fin,
      });
    } catch (error) {
      req.flash('error', error.message);
      res.render('modifierDevoir', {
        message: 'Success',
        status: res.status,
        title: `Devoir`,
        user,
        token: req.body.token,
        cours: coursChoisi,
        devoir: devoirChoisi,
        debut,
        fin,
      });
    }
  }

  /**
   * Fonction de routage pour supprimer le cours sélectionné.
   * 
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function to call in the middleware chain.
   * 
   * @returns {undefined}
   */ 
  public choixCourPourSuppressionDevoir(req: Request, res: Response, next: NextFunction) {
    const {baseUrl, url} = req;
    const matches = (baseUrl + url).match(/[0-9a-zA-Z]*/g);
    const teacher = userController.findTeacher(matches[3]);
    let coursChoisi, devoirChoisi;
    for (const cours of teacher.cours) {
      if (cours.sigle === matches[9]) {
        coursChoisi = cours;
        for (const devoir of cours.listeDevoirs) {
          if (devoir.nom === matches[11]) {
            devoirChoisi = devoir;
            break;
          }
        }
        break;
      }
    }
    const nom = `${teacher.prenom} ${teacher.nom}`;
    const debut = devoirChoisi.dateDebut.toISOString().substring(0, 10);
    const fin = devoirChoisi.dateFin.toISOString().substring(0, 10);
    const user = {nom, isAnonymous: false};
    res.render('afficherDevoirSupprimer', {
      message: 'Success',
      status: res.status,
      title: `Devoir`,
      user,
      token: matches[3],
      cour: coursChoisi,
      devoir: devoirChoisi,
      debut,
      fin,
    });
  }


  /**
     * Supprimer un cours par un enseignant.
     * @function supprimerDevoir
     * @param {Request} req - La requête HTTP entrante.
     * @param {Response} res - La réponse HTTP sortante.
     * @param {NextFunction} next - Le prochain middleware à appeler.
     * @returns {void}
     * @throws {Error} - Erreur si un ou plusieurs paramètres sont manquants.
     */
  public supprimerDevoir(req: Request, res: Response, next: NextFunction) {
    const token = req.body.token;
    const nom = req.params.nom;
    console.log(nom);
    console.log(token);
    let coursChoisi;
    let enseignant = userController.findTeacher(token);
    
    const teacher = userController.findTeacher(req.body.token);
    for (const cours of teacher.cours) {
      if (cours.sigle === req.body.choixCours) {
        coursChoisi = cours;
        break;
      }
    }
    
    try {
      coursChoisi.supprimerDevoir(nom);
      // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
      //this._controleurCours.supprimerCours(nom);
      req.flash('info', `devoir ${nom} supprimé`);
      res.status(200)
        .redirect('/token='+token);
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }  

  private _errorCode500(error: any, req: Request, res: Response<any, Record<string, any>>) {
    req.flash('error', error.message);
    res.status(error.code).redirect('/token='+req.body.token);
  }

  
  init() {
    this.router.get('/afficher/:cour/:devoir',this.detailsDevoir.bind(this));
    this.router.get('/afficher/:cour/devoirs',this.affichageDevoir.bind(this));
    this._router.post('/ajouterDevoir', this.creerDevoir.bind(this));
    this._router.post('/choixCourPourCreationDevoir', this.choixCourPourCreationDevoir.bind(this));
    this.router.get('/modifier/:cour/:devoir',this.choixCourPourModificationDevoir.bind(this));
    this.router.post('/modifierDevoir',this.modifierDevoir.bind(this));
    this.router.get('/supprimer/:cour/:devoir',this.choixCourPourSuppressionDevoir.bind(this));
    this.router.post('/supprimerDevoir/:nom',this.supprimerDevoir.bind(this));
  }
}
export const devoirRoutes = new DevoirRouter();
devoirRoutes.init();