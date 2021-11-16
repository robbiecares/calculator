function add(x, y) {
    return x + y
}

function subtract(x, y) {
    return x - y
}

function multiply(x, y) {
    return x * y
}

function divide(x, y) {
    return x / y
}

function operate(operation, x, y) {
    return (y === 0) ? 'hacker alert!' : operation(x, y)
}




