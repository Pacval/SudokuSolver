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

    /**
     * Permet de visualiser la stratégie de l'IA pour résoudre le sudoku. Retourne true si bloqué
     */
    stepByStep(): boolean {
        if (!this.checkIfFound()) {
            if (!this.eliminateFromGroups()) {
                if (!this.onlyPossibleCaseInGroup()) {
                    if (!this.segmentsInSquare()) {
                        if (!this.segmentsInLine()) {
                            if (!this.segmentsInColumn()) {
                                console.log('the end');
                                return true;
                            } else {
                                console.log('méthode 4.3');
                            }
                        } else {
                            console.log('méthode 4.2');
                        }
                    } else {
                        console.log('méthode 4.1');
                    }
                } else {
                    console.log('méthode 3');
                }
            } else {
                console.log('méthode 2');
            }
        } else {
            console.log('méthode 1');
        }
        console.log('-----------');
        return false;
    }

    isCompleted(): boolean {
        return this.table.find((c) => !c.found) === undefined;
    }

    /* METHODES DE RESOLUTION */

    /**
     * Méthode 1
     * Si la case n'a qu'une possibilité, alors c'est ce chiffre restant
     */
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
     * Méthode 2
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
     * Méthode 3
     * Pour chaque groupe de case, on regarde si un chiffre n'apparait dans les possibilités que d'une seule case.
     * ATTENTION : dès qu'un chiffre a été ajouté, il faut stopper l'éxécution de la fonction,
     * pour pouvoir mettre à jour les cases des mêmes groupes que la case trouvée.
     */
    onlyPossibleCaseInGroup(): boolean {
        for (let group = 1; group <= 9; group++) {
            const line = this.table.filter(element => !element.found && element.x === group);
            const column = this.table.filter(element => !element.found && element.y === group);
            const square = this.table.filter(element => !element.found && element.square === group);

            for (let numberSearched = 1; numberSearched <= 9; numberSearched++) {
                const matchingCasesForLine = line.filter(element => element.possibleValues.includes(numberSearched));
                if (matchingCasesForLine.length === 1) {
                    matchingCasesForLine[0].setValue(numberSearched);
                    return true;
                }

                const matchingCasesForColumn = column.filter(element => element.possibleValues.includes(numberSearched));
                if (matchingCasesForColumn.length === 1) {
                    matchingCasesForColumn[0].setValue(numberSearched);
                    return true;
                }

                const matchingCasesForSquare = square.filter(element => element.possibleValues.includes(numberSearched));
                if (matchingCasesForSquare.length === 1) {
                    matchingCasesForSquare[0].setValue(numberSearched);
                    return true;
                }
            }
        }

        return false;
    }


    /**
     * Méthode 4.1
     * Quand dans un carré, un chiffre n'est possible que sur un segment, alors le candidat peut être exclu de cette colonne/ligne dans les autres carrés
     */
    segmentsInSquare(): boolean {
        let change = false;

        for (let square = 1; square < 10; square++) {
            const squareEmptyCases = this.table.filter(element => element.square === square && !element.found);

            for (let numberSearched = 1; numberSearched < 10; numberSearched++) {
                const possibleCases = squareEmptyCases.filter(element => element.possibleValues.includes(numberSearched));

                // Cette méthode n'est possible à utiliser que si 2 ou 3 cases d'un carré on la même possibilité
                // On sépare ces 2 cas pour tester la correspondance des cases plus simplement
                if (possibleCases.length === 2) {
                    if (possibleCases[0].x === possibleCases[1].x) {
                        // les 2 cases sont sur la meme ligne -> on enlève cette possibilité des autres cases de la ligne
                        this.table
                            .filter(element => element.x === possibleCases[0].x
                                && element.square !== possibleCases[0].square)
                            .forEach(element => {
                                if (element.removePossibility(numberSearched)) {
                                    change = true;
                                }
                            });

                    } else if (possibleCases[0].y === possibleCases[1].y) {
                        // les 2 cases sont sur la meme colonne -> on enlève cette possibilité des autres cases de la colonne
                        this.table
                            .filter(element => element.y === possibleCases[0].y
                                && element.square !== possibleCases[0].square)
                            .forEach(element => {
                                if (element.removePossibility(numberSearched)) {
                                    change = true;
                                }
                            });
                    }

                } else if (possibleCases.length === 3) {
                    // Meme principe mais on doit tester la correspondance des 3 cases
                    if (possibleCases[0].x === possibleCases[1].x && possibleCases[1].x === possibleCases[2].x) {

                        this.table
                            .filter(element => element.x === possibleCases[0].x
                                && element.square !== possibleCases[0].square)
                            .forEach(element => {
                                if (element.removePossibility(numberSearched)) {
                                    change = true;
                                }
                            });

                    } else if (possibleCases[0].y === possibleCases[1].y && possibleCases[1].y === possibleCases[2].y) {

                        this.table
                            .filter(element => element.y === possibleCases[0].y
                                && element.square !== possibleCases[0].square)
                            .forEach(element => {
                                if (element.removePossibility(numberSearched)) {
                                    change = true;
                                }
                            });
                    }
                }
            }
        }

        return change;
    }

    /**
     * Méthode 4.2
     * Quand dans une ligne un seul carré peut contenir un chiffre, ce chiffre peut être exclu des autres cases de ce carré
     */
    segmentsInLine(): boolean {
        let change = false;

        for (let line = 1; line < 10; line++) {
            const lineEmptyCases = this.table.filter(element => element.x === line && !element.found);

            for (let numberSearched = 1; numberSearched < 10; numberSearched++) {
                const possibleCases = lineEmptyCases.filter(element => element.possibleValues.includes(numberSearched));

                if (possibleCases.length === 2) {
                    if (possibleCases[0].square === possibleCases[1].square) {
                        // les 2 cases sont sur le meme carré -> on enlève cette possibilité des autres cases du carré
                        this.table
                            .filter(element => element.square === possibleCases[0].square
                                && element.x !== possibleCases[0].x)
                            .forEach(element => {
                                if (element.removePossibility(numberSearched)) {
                                    change = true;
                                }
                            });
                    }

                } else if (possibleCases.length === 3) {
                    // Meme principe mais on doit tester la correspondance des 3 cases
                    if (possibleCases[0].square === possibleCases[1].square && possibleCases[1].square === possibleCases[2].square) {

                        this.table
                            .filter(element => element.square === possibleCases[0].square
                                && element.x !== possibleCases[0].x)
                            .forEach(element => {
                                if (element.removePossibility(numberSearched)) {
                                    change = true;
                                }
                            });
                    }
                }
            }
        }
        return change;
    }

    /**
     * Méthode 4.3
     * Quand dans une colonne un seul carré peut contenir un chiffre, ce chiffre peut être exclu des autres cases de ce carré
     */
    segmentsInColumn(): boolean {
        let change = false;

        for (let column = 1; column < 10; column++) {
            const columnEmptyCases = this.table.filter(element => element.y === column && !element.found);

            for (let numberSearched = 1; numberSearched < 10; numberSearched++) {
                const possibleCases = columnEmptyCases.filter(element => element.possibleValues.includes(numberSearched));

                if (possibleCases.length === 2) {
                    if (possibleCases[0].square === possibleCases[1].square) {
                        // les 2 cases sont sur le meme carré -> on enlève cette possibilité des autres cases du carré
                        this.table
                            .filter(element => element.square === possibleCases[0].square
                                && element.y !== possibleCases[0].y)
                            .forEach(element => {
                                if (element.removePossibility(numberSearched)) {
                                    change = true;
                                }
                            });
                    }

                } else if (possibleCases.length === 3) {
                    // Meme principe mais on doit tester la correspondance des 3 cases
                    if (possibleCases[0].square === possibleCases[1].square && possibleCases[1].square === possibleCases[2].square) {

                        this.table
                            .filter(element => element.square === possibleCases[0].square
                                && element.y !== possibleCases[0].y)
                            .forEach(element => {
                                if (element.removePossibility(numberSearched)) {
                                    change = true;
                                }
                            });
                    }
                }
            }
        }
        return change;
    }
}