// buttons & divs
const operands = document.querySelectorAll('.operand')
const eqlbtn = document.querySelector('#calc-eql-btn')
const exprDisplay = document.querySelector('#calc-output-expr')
const evalDisplay = document.querySelector('#calc-output-eval')
const clearBtn = document.querySelector('#calc-clear')
const backBtn = document.querySelector('#calc-back-btn')

// event listeners
operands.forEach(operand => operand.addEventListener('click', validateOperandClick))
eqlbtn.addEventListener('click', validateEqlClick)
backBtn.addEventListener('click', validateOperandClick)
clearBtn.addEventListener('click', validateClearClick)

// operator objects & btns
function operatorCreator(expression, symbol, cssId) {
    // Helper function for creating operator objects.
    return {
    expression,
    symbol,
    btn: document.querySelector(cssId)
    }
}
const add = operatorCreator(...[function(x, y) {return x + y}, '+', '#calc-add-btn'])
const sub = operatorCreator(...[function(x, y) {return x - y}, '-', '#calc-sub-btn'])
const mult = operatorCreator(...[function(x, y) {return x * y}, '*', '#calc-mult-btn'])
const div = operatorCreator(...[function(x, y) {return y === 0 ? 'hacker alert!' : (x / y)}, '/', '#calc-div-btn'])
add.btn.addEventListener('click', (e) => validateOperatorClick(e, add))
sub.btn.addEventListener('click', (e) => validateOperatorClick(e, sub))
mult.btn.addEventListener('click', (e) => validateOperatorClick(e, mult))
div.btn.addEventListener('click', (e) => validateOperatorClick(e, div))

// global variables
let operandOne = ''
let operator = undefined
let unconfirmedOperand = ''
let result = ''

// test for reducing fontsize for long inputs/outputs
// const outputAreaWidth = Number(window.getComputedStyle(document.querySelector('#calc-output')).width.slice(0, -2))


function operate() {
    // Evaluates then formats the result of the current expression.

    let value = operator.expression(Number(operandOne), Number(unconfirmedOperand))

    return value.toString()
}

function validateOperandClick(e) {
    // Validates the user key selection then updates unconfirmedOperand.

    let canUpdate = true
    const key = e.target.textContent

    if (key === '.' && unconfirmedOperand.indexOf(key) !== -1) {
        canUpdate = false
    }

    if (canUpdate) { 
        if (key === '←') {
            unconfirmedOperand = unconfirmedOperand.substring(0, unconfirmedOperand.length - 1)
        } else {
            unconfirmedOperand += key
        }
    }
    
    // display result if expression is complete
    if (operandOne && operator && unconfirmedOperand) {
        result = operate()
    }
    
    updateDisplay()
    
}
   
function validateOperatorClick(e, operatorObj) {
    // Validates the user key selection, sets the operator for the current expression. If expression is complete, calls for evaluation.
    
    canUpdate = true
    
    // deactivates the operator buttons if there is no confirmed operand (i.e. handles the initial state)
    if (!unconfirmedOperand && !operandOne) {        
        canUpdate = false
    }

    if (canUpdate) {
        // sets the operator and operandOne (i.e. handles the initial state)
        if (!operator) {
            operator = operatorObj
            operandOne = unconfirmedOperand
            unconfirmedOperand = ''
            result = ''        
        } else {
            // updates the operator before a second operand is provided
            if (!unconfirmedOperand) {
                operator = operatorObj
            // calls for evaluation of the current expression and sets variables for the next expression (i.e. treats the operator as '=')
            } else {
                result = operate()
                unconfirmedOperand = ''
                operandOne = result
                operator = operatorObj
            }
        }
        updateDisplay()
    }
    

}

function validateEqlClick(e) {
    // Validates the current expression is complete then evaluates it.
    
    if (operandOne && operator && unconfirmedOperand) {
        result = operate()
        updateDisplay()
    }
}

function validateClearClick(e) {
    // Clears displayValue or "pops" confirmed values from the current expression.
    
    // if (unconfirmedOperand) {
    //     unconfirmedOperand = ''
    //     operandTwo = ''
    // } else if (result) {
    //     result = ''
    //     operandTwo = ''
    //     operator = undefined
    //     operandOne = ''
    // } else if (operator) {
    //     operator = undefined
    // } else if (operandOne) {
    //     operandOne = ''
    // }
    // updateDisplay()

    unconfirmedOperand = ''
    operator = undefined
    operandOne = ''
    result = ''

    updateDisplay()


}

function updateDisplay() {
    // Updates the display panel of the calculator.    

    // const defaultresultFontSize = Number(window.getComputedStyle(exprDisplay).fontSize.slice(0, -2))

    // // reduces the font size of result to fit into a fixed sized output area
    // let reducedFontSize = defaultresultFontSize
    // while (exprDisplay.scrollWidth > outputAreaWidth) {
    //     exprDisplay.style.fontSize = --reducedFontSize + 'px'
    // }
  
    exprDisplay.textContent = `${operandOne || unconfirmedOperand}${operator ? operator.symbol : ''}${operandOne ? unconfirmedOperand : ''}`
    evalDisplay.textContent = result

    // exprDisplay.style.fontSize = defaultresultFontSize + 'px'

}