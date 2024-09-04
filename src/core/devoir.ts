
export class Devoir {
  devoirId: string;
  coursId: string;
  description: string;
  nom: string;
  noteMax: number;
  dateDebut: Date;
  dateFin: Date;
  isVisible: boolean;


  constructor(nom: string,description: string,noteMax: number,dateDebut: Date,dateFin: Date){
    this.description= description;
    this.nom = nom;
    this.noteMax= noteMax;
    this.dateDebut=dateDebut;
    this.dateFin = dateFin;
  }


  /**
  * Modifier les informations d'un devoir.
  *
  * @param {string} nom - Le nom du devoir.
  * @param {string} description - La description du devoir.
  * @param {number} noteMax - La note maximale possible pour le devoir.
  * @param {Date} dateDebut - La date de début du devoir.
  * @param {Date} dateFin - La date de fin du devoir.
  */
  public modifierDevoir(nom: string,description: string,noteMax: number,dateDebut: Date,dateFin: Date){
    this.description= description;
    this.nom = nom;
    this.noteMax= noteMax;
    this.dateDebut=dateDebut;
    this.dateFin = dateFin;
  }

  /**
  * Convertir l'objet devoir en format JSON.
  *
  * @returns {object} - L'objet devoir en format JSON.
  */
  public toJSON() {
    return {
      nom: this.nom,
      description: this.description,
      noteMax: this.noteMax,
      dateDebut: this.dateDebut,
      dateFin:this.dateFin
    };
  }
  
}