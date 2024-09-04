import { group } from "console";
import { apiservice } from "../apiService";
import { Cours } from "./Cours";
import { Enseignant } from "./enseignant";
import { Etudiant } from "./etudiant";
export class ControleurCours {
    private enseignant:Enseignant;
    private _coursesMap: Map<string,Cours> = new Map<string,Cours>();

    list:Array<Etudiant> = [];
    constructor(enseignant:Enseignant) {
        this.enseignant = enseignant;
    }
    public ajouterCours(cours:string){
       if(!this.coursDejaAjoute(cours)){
            for(let c of apiservice.cours){
                
                if(c[0]=== cours){
                    //this.enseignant.addCours(cours,c[3],c[2],this.creationEtudiant(c[4]));
                }
            }
            return true;
       }else{
        return false;
       }

    }
    public coursDejaAjoute(cours:string){
        for(let cour of this.enseignant.cours){
            console.log(cour.id);
            console.log(cours);
            if(cour.id === cours){console.log(true);return true;}
        }
        return false;
    }

    public creationEtudiant(listeEtudiant:Array<string>){
        let list:Array<Etudiant> = [];
        
        for(let i of listeEtudiant){
            list.push(new Etudiant(i[1],i[2],i[0]));
        }
        return list;
    }
    /**
     *  opérations systèmes (du DSS), responsabilités données aux contrôleur GRASP
     */

    
    // TODO
    public getDetailCours(idCours: string): Cours{
        const course = this.enseignant.cours.find((course) => course.id === idCours);
        return course;
    }
    public getCours(): Array<Cours>{
        return this.enseignant.cours;
    }
    public displayCourse(courseId: string): string {
        return JSON.stringify(this._coursesMap.get(courseId));
    }
    
      
}