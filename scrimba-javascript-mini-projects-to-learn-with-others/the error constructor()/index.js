function checkUsername(userName) {
    if (userName) {
        console.log(userName)
    } else {
        console.log(new Error('No username provided'))
    }
}

checkUsername()