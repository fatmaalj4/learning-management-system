import { Devoir } from "./devoir";
import { Etudiant } from "./etudiant";
import { question } from "./question";
export class Cours {
    // classe inspirée de la classe conceptuelle (du MDD)
    private _id: string;
    private _titre: string;
    private _sigle: string;
    public _listeEtudiant: Array<Etudiant>;
    public _listeDevoirs: Array<Devoir>;
    public _listeQuestions: Array<question>;
    constructor(id: string,titre: string,sigle: string, listeEtudiant:Array<Etudiant>) {
        this._id = id;
        this._titre = titre;
        this._sigle = sigle;
        this._listeEtudiant = listeEtudiant;
        this._listeDevoirs = new Array<Devoir>;
        this._listeQuestions = new Array<question>;
        //this._listeDevoirs.push(new Devoir("aasss","asdfff",55,new Date('2023-02-01'),new Date('2023-02-02')));
    }

    get id(){return this._id;};
    get titre(){return this._titre};
    get sigle(){return this._sigle};
    get listeEtudiant(){return this._listeEtudiant};
    get listeDevoirs(){return this._listeDevoirs};
    get listeQuestions(){return this._listeQuestions};
    /**
     * Assainir (sanitize) le nom.
     * Il serait préférable d'avoir un mutateur privé, mais TypeScript n'aime pas ça
     * @param nom Le nom à assainir
     * @return Le nom, sans espaces blancs au début ou à la fin
     */
    public ajouterDevoir(nom: string,description: string,noteMax: number,dateDebut: Date,dateFin: Date){
        this._listeDevoirs.push(new Devoir(nom,description,noteMax,dateDebut,dateFin));
    }

    public chercherDevoir(nomDevoir:string){
        for(let devoir of this._listeDevoirs){
            if(devoir.nom == nomDevoir){
                return devoir;
            }
        }
    }
    public toJSON() {
        return {
            id: this._id,
            titre: this._titre,
            sigle: this._sigle,
            etudiants: this._listeEtudiant,
            devoirs:this._listeDevoirs,
            questions:this._listeQuestions
        };
    }
}