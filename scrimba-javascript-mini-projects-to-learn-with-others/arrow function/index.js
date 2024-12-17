const speedWarning = (speedLimit, speed) => {
    if (speed > speedLimit) {
       return `You are going at ${speed} mph!`
    }
}



console.log(speedWarning(30, 40))

/*
Challenge
1. Refactor this function so it only warns drivers 
   who are going over the speed limit.
2. The function now needs to take in two parameters. 
   The first is the speed limit, the second is the 
   driver's actual speed.
*/