export class Case {

    possibleValues: number[];

    filledStart: boolean;

    found: boolean;
    finalValue: number;

    constructor(value?: number) {
        if (value === undefined) {
            this.possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            this.filledStart = false;
            this.found = false;
            this.finalValue = null;
        } else {
            this.possibleValues = [];
            this.filledStart = true;
            this.found = true;
            this.finalValue = value;
        }
    }

    /*
        Toutes les fonctions retournent true si la case a été modifiée d'une quelconque manière, false sinon.
        Cela permet de savoir si une méthode a été utile ou non.
    */

    checkIfFound(): boolean {
        if (this.possibleValues.length === 1) {
            this.finalValue = this.possibleValues[0];
            this.possibleValues = [];
            this.found = true;
            return true;
        }
        return false;
    }

    removePossibility(value: number): boolean {
        let i: number;
        if ((i = this.possibleValues.indexOf(value)) > -1) {
            this.possibleValues.splice(i);
            return true;
        }
        return false;
    }

}