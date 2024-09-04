export class Etudiant{
    private _prenom:string;
    private _nom:string;
    private _id:string;
    constructor(prenom: string ,nom:string,id:string) {
        this._prenom = prenom;
        this._nom = nom;
        this._id = id;
    }
    get prenom(){return this._prenom;}
    get nom(){return this._nom;}
    get id(){return this._id;}
    public toJSON() {
        return {
            prenom: this._prenom,
            nom: this._nom,
            id: this._id
        };
    }
    
}