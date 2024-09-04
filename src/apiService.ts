import md5 = require('md5');
import * as fetch from 'node-fetch';
import axios from 'axios';
//import { enseignant } from './core/enseignant';
export class apiService{
   // public teacherId: string = 'cc-vincent.lacasse@etsmtl.ca';
    public urlServeurSGB: string = 'http://localhost:3200';
    public command: string ;
    public groupeCours:JSON;
    public cours: any[];
    public teacherLogin : any[];
    public acceptance:string;
    
    
    public constructor(){
        this.getAllSchedule();
        this.getAllTeacherLogin();
    }
    
    
    public async getTeacherFromToken() {
        this.command = '/api/v3/teacher/fromtoken';
        const url = this.urlServeurSGB + this.command;
        const response = await axios.get(this.urlServeurSGB+'/api/v3/teacher/fromtoken?token='+"9c4149a3e22bf75971083a2f86991fba")
    }



    public async getAllTeacherLogin(){

        const response = await axios.get('http://localhost:3200/api/v3/teacher/all');
        let enseignant = response.data.data.map(x => [x.first_name,x.last_name,x.id]);
        for(let i of enseignant){
            let res= await axios.get("http://localhost:3200/api/v3/teacher/login?email="+i[2]+"&password= ");
            let token = res.data.token;
            i.push(token);

        }
        this.teacherLogin = enseignant;
    }
 
    public async getAllSchedule() {
        this.command = '/api/v3/Schedule/all';
        const url = this.urlServeurSGB + this.command;
        var res = await axios.get(url);
        let mapGroupeCours = res.data.data.map(x => [x.group_id,x.teacher_id]);
        const map = [];
        for(let m of mapGroupeCours){
            map.push(m);
        }
        const reso = await axios.get('http://localhost:3200/api/v3/course/all');
        let cour = reso.data.data.map(x => [x.id,x.titre]);
        for(let i in map){
            for(let j of cour){
                if(map[i][0].includes(j[0])){
                    map[i].push(j[0]);
                    map[i].push(j[1]);
                }
            }    
        }
        const studentCours = await axios.get('http://localhost:3200/api/v3/student/groupstudent');
        let stucours = studentCours.data.data.map(x => [x.group_id,x.student_id]);
        const student = await axios.get('http://localhost:3200/api/v3/student/all');
        let stu = student.data.data.map(x => [x.id,x.first_name,x.last_name]);
            
        for (let i in map) {
            map[i].push([]);
            for (let j of stucours) {
                if(map[i][0]=== j[0]) {
                    for (let k in stu) {
                        if(j[1]===stu[k][0]) {
                            map[i][map[i].length-1].push(stu[k]); 
                        }
                    }   
                }
            }
        }
        
        this.cours = map;
        return map;
    }
}

export const apiservice :apiService = new apiService();
    