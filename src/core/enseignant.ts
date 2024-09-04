import {Cours} from './Cours';
import { Etudiant } from './etudiant';
import { apiservice } from '../apiService';
import { InvalidParameterError } from './errors/invalidParameterError';
export class Enseignant {
  
    // classe inspirée de la classe conceptuelle (du MDD)
    private _prenom: string;
    private _nom: string;
    private _email: string;
    private _token:string;
    private _cours : Array<Cours>;
    constructor(prenom: string ,nom:string,email:string, token:string) {
        this._prenom = prenom;
        this._nom = nom;
        this._email = email;
        this._token = token;
        this._cours = new Array<Cours>();
    }
    get prenom(){return this._prenom};
    get nom(){return this._nom};
    get email(){return this._email};
    get token(){return this._token};
    get cours(){return this._cours};

    public chercherCours(sigle:string){
        for(let cour of this._cours){
            if(cour.sigle === sigle){
                return cour;
            }
        }
    }
    public ajouterCours(cours:string){
        if (!(this._cours.find(element => element.id === cours) == undefined)) {
            throw new InvalidParameterError(`Le cours '${cours.substring(7,13)}' a deja ete ajoute`);
        }
    
        for(let c of apiservice.cours){
            if(c[0]=== cours){
                const cour =new Cours(cours,c[3],c[2],this.creationEtudiant(c[4]));
                this._cours.push(cour);
                console.log(JSON.stringify(cour));

                return JSON.stringify(cour);
            }
        }
     }

     public supprimerCours(cours:string){
        
        if ((this._cours.find(element => element.id === cours) == undefined)) {
        
            throw new InvalidParameterError(`Le cours '${cours}' n'existe pas`);
        }
    
        console.log(this._cours.find(element => element.id === cours));
       let cour = this._cours.splice(
            this._cours.indexOf(this._cours.filter(c => c.id === cours)[0]),1);
        for(let c of cour){
            c._listeDevoirs = null;
            c._listeEtudiant = null;
            c._listeQuestions = null;
        }
     }
 
     public creationEtudiant(listeEtudiant:Array<string>){
         let list:Array<Etudiant> = [];
         
         for(let i of listeEtudiant){
             list.push(new Etudiant(i[1],i[2],i[0]));
         }
         return list;
     }
     public getDetailCours(idCours: string): Cours{
        const cours = this._cours.find((cours) => cours.sigle === idCours);
        return cours;
    }
    
    public toJSON() {
        return {
            prenom: this._prenom,
            nom: this._nom,
            email: this._email
        };
    }
   
}
