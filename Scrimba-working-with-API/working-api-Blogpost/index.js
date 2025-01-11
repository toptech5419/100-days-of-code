let postArray = [];

// Render blog posts to the page
function render() {
    const blogList = document.querySelector(".blog-list");
    let html = "";
    postArray.forEach((post) => {
        html += `
            <article class="blog-post">
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-body">${post.body}</p>
            </article>
        `;
    });
    blogList.innerHTML = html;
}

// Fetch initial posts
fetch("https://apis.scrimba.com/jsonplaceholder/posts", { method: "GET" })
    .then((res) => res.json())
    .then((data) => {
        postArray = data.slice(0, 5); 
        render();
    });

// Handle new post submission
document.querySelector(".post-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const titleInput = document.querySelector("#post-title").value;
    const bodyInput = document.querySelector("#post-body").value;

    const newPost = {
        title: titleInput,
        body: bodyInput,
    };

    fetch("https://apis.scrimba.com/jsonplaceholder/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
    })
        .then((res) => res.json())
        .then((post) => {
            postArray.unshift(post); 
            render(); 
            document.querySelector(".post-form").reset(); 
        });
});
