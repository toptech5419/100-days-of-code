import { catsData } from './data.js'

const getImageBtn = document.getElementById('get-image-btn')
const emotionOptions = document.getElementById('emotion-options')
const gifsOnlyOption = document.getElementById('gifs-only-option')
const memeModalInner = document.getElementById('meme-modal-inner');
const memeModal = document.getElementById('meme-modal');
const memeModalClose = document.getElementById('meme-modal-close-btn')



getImageBtn.addEventListener('click', getImage);
memeModalClose.addEventListener('click', closeModal)

function getImage(e){
    e.preventDefault();
    const catObject = getMatchingArray()
    memeModalInner.innerHTML =  `
        <img 
        class="cat-img" 
        src="./images/${catObject.image}"
        alt="${catObject.alt}"
        >
        `
    memeModal.style.display = 'flex'
}


function getMatchingArray() {
    const selectedEmotion = emotionOptions.value;
    const matchingCatsArray = catsData.filter(function (cats) {
        return cats.emotionTags.includes(selectedEmotion);
    });

    const index = matchingCatsArray.findIndex(function (cat) {
        if(gifsOnlyOption.checked){
            return cat.emotionTags.includes(selectedEmotion) && cat.isGif;
        }else{
        return cat.emotionTags.includes(selectedEmotion);
        }
    });

    return matchingCatsArray[index];
}


function closeModal(){
    memeModal.style.display = 'none'
}

function getEmotion(cats){
    const emotionArray =[]
    for(let cat of cats){
        for(let emotion of cat.emotionTags){
            if(!emotionArray.includes(emotion)){
            emotionArray.push(emotion)
        }
    }
    }
   return emotionArray
}


function renderEmotion(cats){
    let selectEmotion = ''
    const emotions = getEmotion(cats)
    for (let emotion of emotions){
       selectEmotion += `<option class="option" value="${emotion}">${emotion}</option>`
    }
    emotionOptions.innerHTML = selectEmotion
}

renderEmotion(catsData)






