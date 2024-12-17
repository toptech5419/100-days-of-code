const gamer = {
    name: 'Dave',
    score: 0,
    incrementScore: function(){
        this.score++   
    }
}

const gamer1 = {
    name: 'Sarah',
    score: 0,
    incrementScore: function(){
        this.score++   
    }
}

gamer.incrementScore()
gamer1.incrementScore()
console.log(gamer)
console.log(gamer1)
