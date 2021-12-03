// buttons & divs
const operands = document.querySelectorAll('.operand')
const eqlbtn = document.querySelector('#calc-eql-btn')
const calcOutput = document.querySelector('#calc-output')
const exprDisplay = document.querySelector('#calc-output-expr')
const evalDisplay = document.querySelector('#calc-output-eval')
const clearBtn = document.querySelector('#calc-clear')
const backBtn = document.querySelector('#calc-back-btn')
const oneKey = document.querySelector('#one-key')

// event listeners
operands.forEach(operand => operand.addEventListener('click', main))
window.addEventListener('keydown', main)
eqlbtn.addEventListener('click', main)
backBtn.addEventListener('click', main)
clearBtn.addEventListener('click', clearLastExpressionElement)

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
const mult = operatorCreator(...[function(x, y) {return x * y}, 'x', '#calc-mult-btn'])
const div = operatorCreator(...[function(x, y) {return y === 0 ? NaN : (x / y)}, '÷', '#calc-div-btn'])
const exp = operatorCreator(...[function(x, y) {return x ** y}, '^', undefined])

add.btn.addEventListener('click', main)
sub.btn.addEventListener('click', main)
mult.btn.addEventListener('click', main)
div.btn.addEventListener('click', main)

// global variables
let operandOne = ''
let operator = undefined
let unconfirmedOperand = ''
let result = ''
let keylock = false;
let maxWidth = calcOutput.clientWidth


function operate() {
    // Evaluates the current expression.
    
    if (operandOne && operator && unconfirmedOperand && !keylock) {
        let value = operator.expression(Number(operandOne), Number(unconfirmedOperand))
        if (isNaN(value)) {
            keylock = true
            value = 'hacker alert!'
        } else if (value === Infinity)
            keylock = true
        return value.toString()
    }
}


function isValidOperand() {
    // Returns true if unconfirmedOperand is a valid number.

    if (unconfirmedOperand) {
        return !isNaN(Number(unconfirmedOperand))
    }
}


function validateKeySelection(key) {
    // Validates the user's key selection then updates the expression.

    // determines if user input is an operator symbol
    const operatorObj = [add, sub, mult, div].filter(oper => oper.symbol === key)[0]

    // handles expression updates related to the expression's operator
    if (operatorObj) {
        updateOperator(operatorObj)
    // handles expression updates related to an operand
    } else {
        updateOperand(key)
    }
}


function updateOperand(key) {
    // Validates the users key selection when updating the current operand

    // pre-update validation checks
    let canUpdate = true
    
    // prevents the backspace character from being added to the operand
    if (key === '←') {
        unconfirmedOperand = unconfirmedOperand.slice(0, -1)
        canUpdate = false
    }

    // prevents a second decimal point from being added to an operand
    if (key === '.' && unconfirmedOperand.indexOf(key) !== -1) {
        canUpdate = false
    }

    // prevents '=' from being added to the operand
    if (key === '=') {
        canUpdate = false
    }

    // prevents leading zeros in the operand
    if (key === '0' && (!unconfirmedOperand || unconfirmedOperand.startsWith('-'))) {
        canUpdate = false
    }

    if (canUpdate) { 
        unconfirmedOperand += key
    }
}


function updateOperator(operatorObj) {
    // Updates expression operator or positive/negative value of an operand.

    // initially sets operandOne as a negative value
    if (!operandOne && !unconfirmedOperand && operatorObj.symbol === '-') {
        unconfirmedOperand = operatorObj.symbol
    // initially sets operandOne as a positive value
    } else if (!operandOne && unconfirmedOperand === '-' && operatorObj.symbol === '-') {
        unconfirmedOperand = ''
    }

    // initially sets operator
    if (!operator && isValidOperand()) {
        operandOne = unconfirmedOperand
        operator = operatorObj
        unconfirmedOperand = ''
    
    // updates operator before inputting a valid second operand
    } else if (operandOne && !isValidOperand()) {
        // simplifies expression by removing redundant operation symbols (e.g. 3 + -4 is the same as 3 - 4)
        if (operator === sub && (operatorObj === sub || operatorObj == add)) {
            operator = add
        // sets the second operand as negative
        } else if ((operator === mult || operator === div) && operatorObj === sub) {
            unconfirmedOperand = operatorObj.symbol
        // sets the operator as exponent
        } else if (operator === mult && operatorObj === mult) {
            operator = exp
        } else {
            operator = operatorObj
        }
        
    // updates the expression if an operator is entered as an expression evaluator
    } else if (operandOne && operator && isValidOperand()) {
        operandOne = result
        unconfirmedOperand = ''
        operator = operatorObj   
        
        if (operator.symbol === '÷') {
            result = ''            
        }
    }
}


function clearDisplay(e) {
    // Clears all expression elements, any result & resets keylock.

    operandOne = ''
    operator = undefined
    unconfirmedOperand = ''
    result = '' 
    keylock = false
    updateDisplay()
}


function clearLastExpressionElement(e) {
    // Removes last element from the curent expression.
    
    if (result || unconfirmedOperand) {
        result = ''
        unconfirmedOperand = ''
    } else {
        operator = undefined
        unconfirmedOperand = operandOne
        operandOne = ''
    }
    keylock = false
    updateDisplay()
}


function getFontSize(element) {
    return Number(window.getComputedStyle(element).fontSize.slice(0, -2))
}


function adjustOutputFontSize(element, expression) {
    // Updates font size of output elements based upon its length.
    
    const defaultSize = 48
    
    if (getFontSize(element) > defaultSize) {
        element.style.fontSize = defaultSize + 'px'
    } else if (element.scrollWidth >= maxWidth) {
        while (element.scrollWidth >= maxWidth - 30) {
            element.style.fontSize = (getFontSize(element) - 1) + 'px'
            exprDisplay.textContent = expression
            evalDisplay.textContent = result || null
        }
    } else if (element.scrollWidth < maxWidth) {
        while (element.scrollWidth < (maxWidth - 30) && getFontSize(element) < defaultSize) {
            element.style.fontSize = (getFontSize(element) + 1) + 'px'
            exprDisplay.textContent = expression
            evalDisplay.textContent = result || null
        }
    }
}


function updateDisplay() {
    // Updates the display panel of the calculator.    

    let expression = `${operandOne || unconfirmedOperand}${operator ? operator.symbol : ''}${operandOne ? unconfirmedOperand : ''}`

    exprDisplay.textContent = expression
    evalDisplay.textContent = result || null

    adjustOutputFontSize(exprDisplay, expression)
    adjustOutputFontSize(evalDisplay, expression)
}


function validateKeyboardInput(e) {
    // Clears the calc display or returns the value of select keys.
    
    let key

    if (e.key === 'Delete') {
        clearDisplay()
        key = undefined
    } else if (e.key === 'Enter') {
        key = '='
    } else if (e.key === 'Backspace') {
        key = '←'
    } else if (e.key === '*') {
        key = 'x'
    } else if (e.key === '/') {
        e.preventDefault()
        key = '÷'
    } else if ('1234567890.+-'.indexOf(e.key) !== -1) {
        key = e.key
    } else {
        key = undefined
    }
    return key
}


function main(e) {
    // Validates user input then updates the expression and calculator display.

    // normalizes keyboard or mouse input
    let key
    if (e.type === 'keydown') {
        key = validateKeyboardInput(e)
    } else {
        key = e.target.textContent
    }

    if (!keylock && key) {
        validateKeySelection(key)
        
        // evaluates expression if second operand is a valid number & the operation will not cause an error
        if (operandOne) {
            if (operator.symbol !== '÷' && isValidOperand()) {
                result = operate()
            } else if (key === '=')
                result = operate()
            }
    }
        updateDisplay()
    

    
}