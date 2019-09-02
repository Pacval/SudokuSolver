import { Component } from '@angular/core';
import { Case } from 'src/models/case.model';
import { Sudoku } from 'src/models/sudoku.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    values = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    sudoku: Sudoku;

    solve() {
        this.sudoku = new Sudoku();

        for (var i: number = 0; i < 9; i++) {
            for (var j: number = 0; j < 9; j++) {
                
                let caseValue = (<HTMLInputElement>document.getElementById((i + 1) + '-' + (j + 1))).value;

                // Attention ici la value de l'input est récupéré en string
                if (caseValue === "") {
                    this.sudoku.table[i][j] = new Case();
                } else {
                    this.sudoku.table[i][j] = new Case(+caseValue);
                }
            }
        }

        console.log(this.sudoku);
    }
}
