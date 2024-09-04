import { InvalidParameterError } from './errors/invalidParameterError';
import { userController,UserController } from "./userController";
import { Enseignant } from "./enseignant";
import {Cours} from "./Cours"
import { question } from './question';
import { questionVraiFaux } from './questionVraiFaux';
import { questionNumerique } from './questionNumerique';
import { questionEssai } from './questionEssai';
import { questionReponseCourte } from './questionReponseCourte';
import { questionChoixMultiples } from './questionChoixMultiples';

export class QuestionController {
  public uc:UserController;
  constructor(u:UserController){
    this.uc = u;
  }
  public ajouterQuestion(nom: string,enonce: string,choixReponse:Array<string>,reponse:string,retroBR: string,retroMR: string,tags:Array<string>,typeQuestion:string,cours:string,token:string) { 
    var enseignant:Enseignant;
    enseignant = userController.findTeacher(token);
    var cour:Cours = enseignant.chercherCours(cours);
    this.trouverNomQuestionSimilaire(cour.listeQuestions,nom);
    switch(typeQuestion){
      case 'vrai ou faux':{
        cour.listeQuestions.push(new questionVraiFaux(nom,enonce,tags,reponse,retroBR,retroMR));
        console.log(tags);
        break;
      }
      case 'Numerique':{
        cour.listeQuestions.push(new questionNumerique(nom,enonce,tags,reponse,retroBR,retroMR));
        break;
      }
      case 'Essai':{
        cour.listeQuestions.push(new questionEssai(nom,enonce,tags,reponse,retroBR,retroMR));
        break;
      }
      case 'reponseCourte':{
        cour.listeQuestions.push(new questionReponseCourte(nom,enonce,tags,reponse,retroBR,retroMR));
        break;
      }
      case 'choixMultiples':{
        console.log('choixReponse');
        console.log('choixReponse');
        console.log('choixReponse');
        console.log('choixReponse');
        console.log('choixReponse');
        console.log('choixReponse');
        console.log('choixReponse');
        console.log('choixReponse');
        console.log('choixReponse');
        console.log(reponse);
        cour.listeQuestions.push(new questionChoixMultiples(nom,enonce,tags,choixReponse,reponse,retroBR,retroMR));
        break;
      }
    }
  }
  
  public trouverNomQuestionSimilaire(listeQuestions:Array<question>,nom:string){
      for(let question of listeQuestions){
        if(question.nom===nom){
          throw new InvalidParameterError(`Il y a déja une question nommée ${nom}`);
        }
      }
  }
}

