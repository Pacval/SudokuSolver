export class Case {

    x: number;
    y: number;
    square: number; // indique dans quel carré (de 9 cases) est la case

    possibleValues: number[];

    filledStart: boolean;

    found: boolean;
    finalValue: number;

    constructor(x: number, y: number, value?: number) {
        this.x = x;
        this.y = y;

        // calcul du carré
        this.square = 3 * Math.trunc((x - 1) / 3) + Math.trunc((y - 1) / 3);

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
            this.possibleValues.splice(i, 1);
            return true;
        }
        return false;
    }

}