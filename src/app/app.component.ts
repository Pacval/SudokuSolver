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
        this.sudoku = new Sudoku();
        this.processing = false;
    }

    validateInput(x: number, y: number, event: KeyboardEvent) {
        event.preventDefault();
        if (event.charCode > 48 && event.charCode < 58) {
            let tableCase: HTMLInputElement = <HTMLInputElement>document.getElementById(x + '-' + y);
            if (tableCase.value === "") {
                tableCase.value = String.fromCharCode(event.charCode);
            }
        }
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

        // on réinitialise le style des cases avant de lancer
        this.backUserInputs();

        if (!this.checkInputErrors()) {
            this.sudoku.solveSudoku();
            this.printResults();
        }

        this.processing = false;
    }

    checkInputErrors(): boolean {
        let errors = this.sudoku.table
            .filter(element => element.filledStart && // on prend toutes les cases préremplies
                this.sudoku.table.filter(subElement => subElement.filledStart &&
                    element.finalValue === subElement.finalValue && // on regarde si il existe une case qui a la meme valeur
                    (element.x === subElement.x || element.y === subElement.y || element.square === subElement.square) && // et qui est soit sur la meme ligne, sur la meme colonne, ou dans le meme carré
                    (element.x !== subElement.x || element.y !== subElement.y) // mais qui n'est pas la meme case que celle de base
                ).length !== 0);

        if (errors.length !== 0) {
            errors.forEach(element => {
                document.getElementById(element.x + '-' + element.y).setAttribute('class', 'input-error');
            });
            return true;
        } else {
            return false;
        }
    }

    printResults() {
        this.sudoku.table.forEach(element => {
            let tableCase: HTMLInputElement = <HTMLInputElement>document.getElementById(element.x + '-' + element.y);
            if (element.filledStart) {
                tableCase.setAttribute('class', 'input-filledStart');
            } else if (element.found) {
                tableCase.value = "" + element.finalValue;
                tableCase.setAttribute('class', 'input-foundIA');
            } else {
                tableCase.setAttribute('class', 'input-notFound');
            }
        });
    }

    backUserInputs() {
        this.sudoku.table.forEach(element => {
            let tableCase: HTMLInputElement = <HTMLInputElement>document.getElementById(element.x + '-' + element.y);
            tableCase.setAttribute('class', 'input-empty');
            if (!element.filledStart) {
                tableCase.value = "";
            }
        });
    }

    reinitialization() {
        for (var i of this.values) {
            for (var j of this.values) {
                let tableCase: HTMLInputElement = <HTMLInputElement>document.getElementById(i + '-' + j);
                tableCase.value = "";
                tableCase.setAttribute('class', 'input-empty');
            }
        }
    }
}
