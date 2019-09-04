import { Component, OnInit } from '@angular/core';
import { Case } from 'src/models/case.model';
import { Sudoku } from 'src/models/sudoku.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    
    values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    sudoku: Sudoku;
    
    processing: boolean;
    
    ngOnInit(): void {
        this.processing = false;
    }
    
    solve() {
        this.processing = true;

        this.sudoku = new Sudoku();

        for (var i of this.values) {
            for (var j of this.values) {

                let caseValue = (<HTMLInputElement>document.getElementById(i + '-' + j)).value;

                // Attention ici la value de l'input est récupéré en string
                if (caseValue === "") {
                    this.sudoku.table.push(new Case(i, j));
                } else {
                    this.sudoku.table.push(new Case(i, j, +caseValue));
                }
            }
        }
        
        this.sudoku.solveSudoku();

        this.printResults();
        
        this.processing = false;
    }

    printResults() {
        this.sudoku.table.forEach(element => {
            let tableCase: HTMLInputElement = <HTMLInputElement>document.getElementById(element.x + '-' + element.y);
            if(element.filledStart) {
                tableCase.setAttribute('class', 'input-filledStart');
            } else if (element.found) {
                tableCase.value = "" + element.finalValue;
                tableCase.setAttribute('class', 'input-foundIA');
            } else {
                tableCase.setAttribute('class', 'input-notFound');
            }
        });
    }
}
