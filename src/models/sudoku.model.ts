import { Case } from "./case.model";

export class Sudoku {

    table: Case[][];

    constructor() {
        this.table = [];

        for(var i: number = 0; i < 9; i++) {
            this.table[i] = [];
        }
    }


    solveSudoku() {

    }

    isCompleted(): boolean {
        return false;
    }
}