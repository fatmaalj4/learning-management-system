export class question{
    nom:string;
    enonce:string;
    tags:Array<String>;
    type:string;
    constructor(nom:string,enonce:string,tags:Array<String>,type:string){
        this.nom = nom;
        this.enonce = enonce;
        this.tags = tags;
        this.type = type;
    }
    public toJSON() {
        return {
          nom: this.nom,
          enonce: this.enonce,
          tags: this.tags,
          type:this.type
          //reponse: this.reponse,
          //retroBR:this.retroBR,
          //retroMR:this.retroMR
        };
    }
}