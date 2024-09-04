import { question } from "./question";
export class questionChoixMultiples extends question{
    reponse:string;
    retroBR:string;
    retroMR:string;
    choixReponse:Array<String>;
    constructor(nom:string,enonce:string,tags:Array<String>,choixReponse:Array<String>,reponse:string,retroBR:string,retroMR:string){
        super(nom,enonce,tags,"choixMultiples");
        this.choixReponse = choixReponse;
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
          choixReponse: this.choixReponse,
          reponse: this.reponse,
          retroBR:this.retroBR,
          retroMR:this.retroMR
        };
    }

}