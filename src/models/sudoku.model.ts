import { Case } from "./case.model";

export class Sudoku {

    table: Case[];

    constructor() {
        this.table = [];
    }


    solveSudoku() {
        let cantDoMore = false;

        while (!this.isCompleted() && !cantDoMore) {
            if (!this.checkIfFound()) {
                // Si la 1ere methode retourne true, qqchose a été modifié. Donc on continue. Sinon, rien n'a été modifié, donc on essaye un algo plus poussé
                if (!this.easyClearPossibilities()) {
                    cantDoMore = true;
                }
            }
        }
    }

    isCompleted(): boolean {
        return this.table.find((c) => !c.found) === undefined;
    }

    /* METHODES DE RESOLUTION */

    checkIfFound(): boolean {
        let change = false;
        this.table.forEach(element => {
            if (element.checkIfFound()) {
                change = true;
            }
        });
        return change;
    }

    easyClearPossibilities(): boolean {
        let change = false;

        this.table.filter(item => item.found).forEach(baseCase => {
            // Pour chaque case remplie, on récupère toutes les cases non remplies sur la meme ligne, colonne ou carré, et on enlève la possibilité de la valeur de la case de base
            this.table
                .filter(item => !item.found && (item.x === baseCase.x || item.y === baseCase.y || item.square === baseCase.square))
                .forEach(caseMod => {
                    if(caseMod.removePossibility(baseCase.finalValue)) {
                        change = true;
                    }
                });
        });

        return change;
    }
}