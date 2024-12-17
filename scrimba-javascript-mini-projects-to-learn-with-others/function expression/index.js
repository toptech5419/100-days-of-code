/*
Challenge:
    1. Convert this function declaration to a function expression.
*/

const getTheftAlert = function(numberOfTransactionsHour){
    if (numberOfTransactionsHour > 5) {
        return `You have made ${numberOfTransactionsHour} transactions 
                in the past hour. We think your card might have been 
                compromised`
    }  
}
console.log(getTheftAlert(6))


