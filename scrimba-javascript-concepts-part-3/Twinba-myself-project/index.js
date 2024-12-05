import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

function getData(datas){
    let data = ``
    datas.forEach(function(tweet){
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
            <div class="tweet-reply">
            <div class="tweet-inner">
            <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
            </div>
            </div>
`
            })
        }

        data += `<div class="tweet">
            <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic" alt="name-profile-pics">
            <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text" data-tweetid="${tweet.uuid}">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length === 0 ? '' : tweet.replies.length}
                </span>
                <span class="tweet-detail">
                <i id="like-${tweet.uuid}" class="fa-solid fa-heart ${tweet.isLiked ? 'liked' : ''}" data-like="${tweet.uuid}"></i>
                ${tweet.likes === 0 ? '' : tweet.likes}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-retweet ${tweet.isRetweeted ? 'retweeted' : ''}" data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets === 0 ? '' : tweet.retweets}
                </span>
            </div>   
            </div>            
            </div>
        <div class="hidden" id="show-${tweet.uuid}">
         ${repliesHtml}
        </div>  
        
        

        <div class ="reply-container hidden" id="reply-${tweet.uuid}">
        <div class="tweet-input-area">
            <img src="images/scrimbalogo.png" class="profile-pic" id="profile-pic" alt="Scrimba Logo">
			<textarea placeholder="Write a reply?" id="tweet-reply-input"></textarea>
        </div>
        <button type="button" id="reply-btn">reply</button>
        </div>
        </div>
        `
    })
   return data
}

function render(){
    document.getElementById('feed').innerHTML = getData(tweetsData)
}

render()

document.addEventListener("click", function(e) {
    if (e.target.dataset.like) {
        getLike(e.target.dataset.like);
    } else if (e.target.dataset.retweet) {
        getRetweet(e.target.dataset.retweet);
    } 
    else if (e.target.dataset.reply) {
        getReply(e.target.dataset.reply);
    } else if (e.target.id === "tweet-btn") {
        tweetBtn(tweetsData);
    }else if (e.target.closest('[data-tweetid]')) {
        const targetElement = e.target.closest('[data-tweetid]');
        const tweetId = targetElement.dataset.tweetid; 
        showfullTweet(tweetId);
    }
        
});


function getLike(likeId){
const likeObj = tweetsData.filter(function(tweet){
    return tweet.uuid === likeId
})[0]

if(likeObj.isLiked === false){
likeObj.likes++
}else{
    likeObj.likes--
}
likeObj.isLiked = !likeObj.isLiked
 render()
}

function getRetweet(retweetId){
    const retweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === retweetId
    })[0]

    if(retweetObj.isRetweeted === false){
        retweetObj.retweets++
        retweetObj.isRetweeted = true
    }else{
        retweetObj.retweets--
        retweetObj.isRetweeted = false
    }

    render()
}

function getReply(replyId) {
    const replyContainer = document.getElementById(`reply-${replyId}`);
    replyContainer.classList.remove('hidden');

    document.body.style.overflow = 'hidden';

    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; 
    overlay.style.zIndex = '999'; 
    document.body.appendChild(overlay);

    replyContainer.style.zIndex = '1000';

    const replyInput = document.querySelector(`#reply-${replyId} textarea`);
    const replyBtn = document.querySelector(`#reply-${replyId} button`);

    replyBtn.addEventListener(
        'click',
        function handleReply() {
            const replyObj = tweetsData.find(tweet => tweet.uuid === replyId);

            if (replyInput.value.trim()) {

                replyObj.replies.unshift({
                    handle: `@Toptech ✅`,
                    profilePic: `images/overflow.png`,
                    tweetText: replyInput.value.trim(),
                });

                replyInput.value = '';
                render();
                document.getElementById(`show-${replyId}`).classList.remove('hidden');
                closeReplyContainer(replyContainer, overlay);
                replyBtn.removeEventListener('click', handleReply);
            } else {
                alert('Reply cannot be empty!');
            }
        },
        { once: true } 
    );

    overlay.addEventListener('click', function handleOverlayClick() {
        closeReplyContainer(replyContainer, overlay);
        overlay.removeEventListener('click', handleOverlayClick);
    });
}

function closeReplyContainer(replyContainer, overlay) {
    replyContainer.classList.add('hidden');

    document.body.style.overflow = '';

    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
}



function tweetBtn(newTweet){
    const tweetInput = document.getElementById("tweet-input")
    if(tweetInput.value === ''){
        alert("tweet can't be empty")
    } else{
    newTweet.unshift({
        handle: `@Elon ✅`,
        profilePic: `images/love.png`,
        likes: '',
        retweets: '',
        tweetText: tweetInput.value,
        replies: [
        ],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4()
    
    })
}
    render()
    tweetInput.value = ''
}

function showfullTweet(fullTweetId){
    document.getElementById(`show-${fullTweetId}`).classList.toggle('hidden')
}

