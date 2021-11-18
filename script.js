// buttons & divs
const operands = document.querySelectorAll('.operand')
const eqlbtn = document.querySelector('#calc-eql-btn')
const exprDisplay = document.querySelector('#calc-output-expr')
const evalDisplay = document.querySelector('#calc-output-eval')
const clearBtn = document.querySelector('#calc-clear')
const backBtn = document.querySelector('#calc-back-btn')

// global variables
let operandOne = ''
let operator = ''
let operandTwo = ''
let result = ''
let displayValue = ''


function operatorCreator(expression, symbol, cssId) {
    // generic function for creating operator objects
    return {
    expression,
    symbol,
    btn: document.querySelector(cssId)
    }
}

// operator objects
const add = operatorCreator(...[function(x, y) {return x + y}, '+', '#calc-add-btn'])
const sub = operatorCreator(...[function(x, y) {return x - y}, '-', '#calc-sub-btn'])
const mult = operatorCreator(...[function(x, y) {return x * y}, '*', '#calc-mult-btn'])
const div = operatorCreator(...[function(x, y) {return y === 0 ? 'hacker alert!' : (x / y)}, '/', '#calc-div-btn'])

add.btn.addEventListener('click', (e) => validateOperatorClick(e, add))
sub.btn.addEventListener('click', (e) => validateOperatorClick(e, sub))
mult.btn.addEventListener('click', (e) => validateOperatorClick(e, mult))
div.btn.addEventListener('click', (e) => validateOperatorClick(e, div))

operands.forEach(operand => operand.addEventListener('click', (e) => validateOperandClick(e)))

eqlbtn.addEventListener('click', validateEqlClick)

backBtn.addEventListener('click', (e) => validateBackClick(e))
clearBtn.addEventListener('click', validateClearClick)

function operate(operator, operandOne, operandTwo) {
    // Executes the expression

    return operator.expression(Number(operandOne), Number(operandTwo))
}

function validateOperandClick(e) {
    // Updates the current displayValue.

    let canUpdate = true
    const key = e.target.textContent


    if (key === '.' && displayValue.indexOf(key) !== -1) {
        canUpdate = false
    }
    
    if (canUpdate) { 
        updateDisplayValue(e)
        updateDisplay()
    }
}
    
function validateOperatorClick(e, operatorObj) {
    // Set the operator for the current expression.
    
    if (operator) {
        validateEqlClick(e, operatorObj)
    }
    if (!operator) {
        operator = operatorObj
    }
    if (!operandOne) {
        operandOne = updateDisplayValue(e)
    }
    updateDisplay()
}

function validateBackClick(e) {
    // Removes the last character from displayValue.
    
    if (displayValue) {
        updateDisplayValue(e)
    }
}

function validateEqlClick(e, operatorObj) {
    // Evaluates the current expression.
    
    if (operandOne && operator) {
        operandTwo = updateDisplayValue(e)
        result = operate(operator, operandOne, operandTwo)
        updateDisplay()

        // reset variables for next calculation
        operandOne = result
        // result = ''
        operator = operatorObj || undefined
        operandTwo = ''
    }
}

function validateClearClick(e) {
    // Clears displayValue or "pops" confirmed values from the current expression.
    
    if (displayValue) {
        displayValue = ''
    } else if (result) {
        result = ''
        operandTwo = ''
        operator = undefined
        operandOne = ''
    } else if (operator) {
        operator = undefined
    } else if (operandOne) {
        operandOne = ''
    }
    updateDisplay()


}

function updateDisplayValue(e) {
    // Updates displayValue based on the user's key selection.

    const key = e.target.textContent

    if (key === '←') {
        displayValue = displayValue.substring(0, displayValue.length - 1)
    } else if ('+-*/='.indexOf(key) !== -1) {
        let value = displayValue
        displayValue = ''
        return value
    } else {
        displayValue += key
    }
    updateDisplay()
}

function updateDisplay() {
    // Updates the display panel of the calculator.
    
    exprDisplay.textContent = `${operandOne || displayValue}${operator ? operator.symbol : ''}${operator ? operandTwo || displayValue : ''}`
    evalDisplay.textContent = result
}