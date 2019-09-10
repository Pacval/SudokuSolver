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
                if (!this.eliminateFromGroups()) {
                    if (!this.onlyPossibleCaseInGroup()) {
                        cantDoMore = true;
                    }
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

    /**
     * Pour chaque case remplie, on récupère toutes les cases non remplies sur la meme ligne, colonne ou carré,
     * et on enlève la possibilité de la valeur de la case de base
     */
    eliminateFromGroups(): boolean {
        let change = false;

        this.table.filter(item => item.found).forEach(baseCase => {
            this.table
                .filter(item => !item.found && (item.x === baseCase.x || item.y === baseCase.y || item.square === baseCase.square))
                .forEach(caseMod => {
                    if (caseMod.removePossibility(baseCase.finalValue)) {
                        change = true;
                    }
                });
        });

        return change;
    }

    /**
     * Pour chaque groupe de case, on regarde si un chiffre n'apparait dans les possibilités que d'une seule case
     */
    onlyPossibleCaseInGroup(): boolean {
        let change = false;

        for (let group = 1; group <= 9; group++) {
            const line = this.table.filter(element => !element.found && element.x === group);
            const column = this.table.filter(element => !element.found && element.y === group);
            const square = this.table.filter(element => !element.found && element.square === group);

            for (let numberSearched = 1; numberSearched <= 9; numberSearched++) {
                const matchingCasesForLine = line.filter(element => element.possibleValues.includes(numberSearched));
                if (matchingCasesForLine.length === 1) {
                    matchingCasesForLine[0].setValue(numberSearched);
                }

                const matchingCasesForColumn = column.filter(element => element.possibleValues.includes(numberSearched));
                if (matchingCasesForColumn.length === 1) {
                    matchingCasesForColumn[0].setValue(numberSearched);
                }

                const matchingCasesForSquare = square.filter(element => element.possibleValues.includes(numberSearched));
                if (matchingCasesForSquare.length === 1) {
                    matchingCasesForSquare[0].setValue(numberSearched);
                }
            }
        }

        return change;
    }
}