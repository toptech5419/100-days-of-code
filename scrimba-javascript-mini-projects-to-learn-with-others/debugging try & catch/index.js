function addTouristSurcharge(payment) {
    try {
        if (typeof payment === 'number') {
            console.log(payment + 10)
        } else {
            throw new ReferenceError('payment is not a number')
        }
    } catch (err) {
        console.error('Error: ' + err)
    }
}

addTouristSurcharge('60')