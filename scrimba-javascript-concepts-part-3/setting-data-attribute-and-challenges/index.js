document.addEventListener('click', function(e) {
    if (e.target.id){
        console.log(e.target.id)
    }
    else if (e.target.dataset.heart){
        console.log(e.target.dataset.heart)
    }
/*
Challenge:
2. Make clicking on the heart icon log out
   the id of the image.
*/
})

// DataAttribute Naming Convention
// 2. use camelcase for dataset names

