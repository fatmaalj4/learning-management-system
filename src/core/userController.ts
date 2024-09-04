import { Enseignant } from "./enseignant";

export class UserController{
    
    Enseignants:Array<Enseignant> = new Array<Enseignant>();

    public findTeacher(token:string){
        console.log(token);
        for(let enseignant of this.Enseignants){
            if(token === enseignant.token){
                console.log(enseignant);
                return enseignant;
            }
        }
    }

    


}

export const userController:UserController = new UserController();