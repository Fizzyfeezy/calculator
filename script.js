class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.readyToReset = false;
        this.clear();
    }

    view(){
        this.currentOperand = "0";
        this.previousOperand = "0";
        this.currentOperandTextElement.innerText = this.currentOperand;
        this.previousOperandTextElement.innerText = this.previousOperand;
    }

    clear() {
        this.currentOperand = "0";
        this.readyToReset = true;
        this.previousOperand = "0";
        this.operation = undefined;
    }

    delete(){
        this.currentOperand = this.currentOperand.toString().slice(0,-1);
    }

    appendNumber(number) {
        if (number === "." && this.currentOperand.includes(".")) return
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation){
        if (this.currentOperand === "")
            return
            if (this.previousOperand !== "") {
                this.compute();
            }
            this.readyToReset = true;
            this.operation = operation;
            this.previousOperand = this.currentOperand;
            this.currentOperand = "";      
    }

    percentage(){
        this.readyToReset = true;
        const current = parseFloat(this.currentOperand);
        this.currentOperand = current * (0.01);
    }
    roundNumber(num, scale) {
        if(!("" + num).includes("e")) {
          return +(Math.round(num + "e+" + scale)  + "e-" + scale);
        } else {
          const arr = ("" + num).split("e");
          const sig = ""
          if(+arr[1] + scale > 0) {
            sig = "+";
          }
          return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
        }
    }

    compute(){
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return
        switch (this.operation) {
            case "+":
                computation = prev + current;
            break;

            case "-":
                computation = prev - current;
            break;

            case "x":
                computation = prev * current;
            break;

            case "÷":
                computation = prev / current;
            break;
        
            default:
                return;
        }
        this.readyToReset = true;
        this.currentOperand = this.roundNumber(computation,4);
        this.operation = undefined;
        this.previousOperand = "";
    }

    getDisplayNumber(number){
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = `${0}`;
        }
        else{
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        }
        // else if(decimalDigits != null && integerDisplay === "0"){
        //     return `${0}.${decimalDigits}`;
        // }
        else{
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);

        const prevOperand = parseFloat(this.previousOperand,10);
        const curOperand = parseFloat(this.currentOperand,10);
        if(this.operation != null) {
            this.previousOperandTextElement.innerText = `${prevOperand} ${this.operation}`;
        }
        else if(this.previousOperandTextElement.innerText == `${prevOperand} ${this.operation}` && curOperand == true) {
            this.previousOperandTextElement.innerText = `${prevOperand} ${this.operation} ${curOperand}`;
        }
        else if(curOperand != null) {
            this.previousOperandTextElement.innerText = `${curOperand}`;
        }
        else{
            this.previousOperandTextElement.innerText = "";
        }
    }
}


const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const percentButton = document.querySelector("[data-percent]");
const previousOperandTextElement = document.querySelector("[data-previous-operand]");
const currentOperandTextElement = document.querySelector("[data-current-operand]");


const calculator = new Calculator(previousOperandTextElement,
    currentOperandTextElement);

calculator.view();

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        if(calculator.previousOperand === "" &&
            calculator.currentOperand !== "" &&
            calculator.readyToReset) {
            calculator.currentOperand = "";
            calculator.readyToReset = false;
        }
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    })
})

operationButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    })
})

equalsButton.addEventListener("click", () => {
    calculator.compute();
    calculator.updateDisplay();
})

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
})

percentButton.addEventListener('click', () => {
    calculator.percentage();
    calculator.updateDisplay();
})

