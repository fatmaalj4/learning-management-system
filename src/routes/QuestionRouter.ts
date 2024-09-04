import { Console } from 'console';
import { NextFunction, Request, Response, Router } from 'express';
import { QuestionController } from '../core/QuestionController';
import { userController } from '../core/userController';

export class QuestionRouter {
  private _router: Router;
  private _devoirController: QuestionController;

  get router() {
    return this._router;
  }

  constructor() {
    this._router = Router();
    this._devoirController = new QuestionController(userController);
    this.init();
  }
  get devoirController() {
    return this._devoirController
  }
  //
  //routes pour ajout de devoir
  //
  public choixCourPourCreationQuestion(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    
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
    
      res.render('ajouterQuestion', {
        message: 'Success',
        status: res.status,
        title: `Devoir`,
        user: user,
        token: req.body.token,
        cour: coursChoisi,
        questions: coursChoisi.listeQuestions
      });
    }else{
      req.flash('error', `Veuillez choisir un cour`);
      res.redirect('/token='+req.body.token);
    }
     
  }
  
  public ajouterQuestionVraiFaux(req: Request, res: Response, next: NextFunction) { 
    console.log(req.body); 
    let enseignant = userController.findTeacher(req.body.token);
    let coursChoisi;
    for(let cour of enseignant.cours){
      if(cour.sigle ===req.body.choixCours){
        coursChoisi = cour
        break;
      }
    }
    let tags = new Array<string>;
    if(req.body.intra === "on"){
      tags.push('intra');
    }
    if(req.body.final === "on"){
      tags.push('final');
    }
    if(req.body.quiz === "on"){
      tags.push('quiz');
    }
    if(req.body.general === "on"){
      tags.push('general');
    }
    let user = {nom:enseignant.prenom+ " "+enseignant.nom, isAnonymous: false };
    try{
      this.devoirController.ajouterQuestion(req.body.nom,req.body.enonce,req.body.choixReponse,req.body.reponse,req.body.retroBR,req.body.retroMR,tags,req.body.typeQuestion,req.body.choixCours,req.body.token);
      res.render('ajouterQuestion', {
        message: 'Success',
        status: res.status,
        title: `Devoir`,
        user: user,
        token: req.body.token,
        cour: coursChoisi,
        questions: coursChoisi.listeQuestions
      });
    }catch(e){
      req.flash('error', e.message);
      res.render('ajouterQuestion', {
        message: 'Success',
        status: res.status,
        title: `Devoir`,
        user: user,
        token: req.body.token,
        cour: coursChoisi,
        questions:coursChoisi.listeQuestions
      });
    }
    
    
  }
  public ajouterQuestionChoixMultiples(req: Request, res: Response, next: NextFunction) {
    console.log(req.body); 
    let enseignant = userController.findTeacher(req.body.token);
    let coursChoisi;
    for(let cour of enseignant.cours){
      if(cour.sigle ===req.body.choixCours){
        coursChoisi = cour
        break;
      }
    }
    let tags = new Array<string>;
    if(req.body.intra === "on"){
      tags.push('intra');
    }
    if(req.body.final === "on"){
      tags.push('final');
    }
    if(req.body.quiz === "on"){
      tags.push('quiz');
    }
    if(req.body.general === "on"){
      tags.push('general');
    }
    let choixReponse:Array<string> = new Array<string>;
    choixReponse.push(req.body.choixReponse1);
    choixReponse.push(req.body.choixReponse2);
    choixReponse.push(req.body.choixReponse3);
    choixReponse.push(req.body.choixReponse4);
    let reponse;
    if(req.body.reponse === '1'){
      reponse = choixReponse[0];
    }
    if(req.body.reponse === '2'){
      reponse = choixReponse[1];
    }
    if(req.body.reponse === '3'){
      reponse = choixReponse[2];
    }
    if(req.body.reponse === '4'){
      reponse = choixReponse[3];
    }
    let user = {nom:enseignant.prenom+ " "+enseignant.nom, isAnonymous: false };
    try{
      this.devoirController.ajouterQuestion(req.body.nom,req.body.enonce,choixReponse,reponse,req.body.retroBR,req.body.retroMR,tags,"choixMultiples",req.body.choixCours,req.body.token);
      res.render('ajouterQuestion', {
        message: 'Success',
        status: res.status,
        title: `Devoir`,
        user: user,
        token: req.body.token,
        cour: coursChoisi,
        questions:coursChoisi.listeQuestions
      });
    }catch(e){
      req.flash('error', e.message);
      res.render('ajouterQuestion', {
        message: 'Success',
        status: res.status,
        title: `Devoir`,
        user: user,
        token: req.body.token,
        cour: coursChoisi,
        questions:coursChoisi.listeQuestions
      });
    }
  }
  public redirectionChoixQuestion(req: Request, res: Response, next: NextFunction){
    console.log(req.body);
    let teacher = userController.findTeacher(req.body.token);
    let user = {nom:teacher.prenom+ " "+teacher.nom, isAnonymous: false };
    switch(req.body.choixQuestion){
      case 'vrai ou faux':{
        console.log("req.body");
        res.render('ajouterQuestionVraiFaux', {
          message: 'Success',
          status: res.status,
          title: `Question`,
          user: user,
          token: req.body.token,
          cour: req.body.choixCours,
          typeQuestion : req.body.choixQuestion
        });
      }
      case 'choix multiples':{
        console.log("req.body");
        res.render('ajouterQuestionChoixMultiple', {
          message: 'Success',
          status: res.status,
          title: `Question`,
          user: user,
          token: req.body.token,
          cour: req.body.choixCours,
          typeQuestion : req.body.choixQuestion
        });
      }
      case 'numerique':{
        console.log("req.body");
        res.render('ajouterQuestionNumerique', {
          message: 'Success',
          status: res.status,
          title: `Question`,
          user: user,
          token: req.body.token,
          cour: req.body.choixCours,
          typeQuestion : req.body.choixQuestion
        });
      }
      case 'essai':{
        console.log("req.body");
        res.render('ajouterQuestionEssai', {
          message: 'Success',
          status: res.status,
          title: `Question`,
          user: user,
          token: req.body.token,
          cour: req.body.choixCours,
          typeQuestion : req.body.choixQuestion
        });
      }
      case 'reponseCourte':{
        console.log("req.body");
        res.render('ajouterQuestionReponseCourte', {
          message: 'Success',
          status: res.status,
          title: `Question`,
          user: user,
          token: req.body.token,
          cour: req.body.choixCours,
          typeQuestion : req.body.choixQuestion
        });
      }
    }
  }
  //
  //routes pour l'affichage de devoirs
  //
  
  init() {
    this._router.post('/ajouterQuestionVraiFaux', this.ajouterQuestionVraiFaux.bind(this));
    this._router.post('/ajouterQuestionChoixMultiples', this.ajouterQuestionChoixMultiples.bind(this));
    this._router.post('/choixCourPourCreationQuestions', this.choixCourPourCreationQuestion.bind(this));
    this._router.post('/redirectionChoixQuestion',this.redirectionChoixQuestion.bind(this));
  }
}
export const questionRoutes = new QuestionRouter();
questionRoutes.init();