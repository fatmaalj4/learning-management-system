import { question } from "./question";

export class questionEssai extends question{
    reponse:string;
    retroBR:string;
    retroMR:string;
    constructor(nom:string,enonce:string,tags:Array<String>,reponse:string,retroBR:string,retroMR:string){
        super(nom,enonce,tags,"Essai");
        this.reponse = reponse;
        this.retroBR = retroBR;
        this.retroMR = retroMR;
    }
    public toJSON() {
        return {
          nom: this.nom,
          enonce: this.enonce,
          tags: this.tags,
          type: this.type,
          reponse: this.reponse,
          retroBR:this.retroBR,
          retroMR:this.retroMR
        };
    }

}