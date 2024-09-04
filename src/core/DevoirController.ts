import { Devoir} from './devoir';
import { InvalidParameterError } from './errors/invalidParameterError';
import { userController,UserController } from "./userController";
import { Enseignant } from "./enseignant";
import {Cours} from "./Cours"

export class DevoirController {
  public uc:UserController;
  constructor(u:UserController){
    this.uc = u;
  }
  public ajoutDevoir(nom: string,description: string,noteMax: number,dateDebut: Date,dateFin: Date,cours:string,token:string) {
    if(dateFin<=dateDebut){
      throw new InvalidParameterError(`La date de fin doit etre apres la date de debut`);
    }  
    
    var enseignant:Enseignant;
    enseignant = userController.findTeacher(token);
    var cour:Cours = enseignant.chercherCours(cours);
    this.trouverNomDevoirSimilaire(cour.listeDevoirs,nom);

    cour.ajouterDevoir(nom,description,noteMax,dateDebut,dateFin);

  }
  public afficherDevoir(nom: string,token:string,cour:string) {
    let enseignant = userController.findTeacher(token);
    let cours = enseignant.getDetailCours(cour);
    return cours.chercherDevoir(nom);
  }

  public modifierDevoir(nom: string,description: string,noteMax: number,dateDebut: Date,dateFin: Date,cours:string,token:string,oldName:string) {
    if(dateFin<=dateDebut){
      throw new InvalidParameterError(`La date de fin doit etre apres la date de debut`);
    } 
    let enseignant = userController.findTeacher(token);
    let courChoisi = enseignant.getDetailCours(cours);
    if(oldName === nom){
      let devoir =courChoisi.chercherDevoir(nom);
      devoir.modifierDevoir(nom,description,noteMax,dateDebut,dateFin);

    }else{
      this.trouverNomDevoirSimilaire(courChoisi.listeDevoirs,nom);
      let devoir =courChoisi.chercherDevoir(oldName);
      devoir.modifierDevoir(nom,description,noteMax,dateDebut,dateFin);
    }
  }
  public supprimerDevoir(nomDevoir:String,token:string,sigleCour:string){
    let enseignant =userController.findTeacher(token);
    let courChoisi=enseignant.getDetailCours(sigleCour);

    for(let i = 0; i < courChoisi.listeDevoirs.length;i++){
      if(courChoisi.listeDevoirs[i].nom === nomDevoir){
        courChoisi.listeDevoirs.splice(i,1);
        break;
      }
    }

  }
  public trouverNomDevoirSimilaire(listeDevoir:Array<Devoir>,nom:string){
      for(let devoir of listeDevoir){
        if(devoir.nom===nom){
          throw new InvalidParameterError(`Il y a deja un devoir nomme ${nom}`);
        }
      }
  }
}

