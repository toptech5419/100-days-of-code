document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navList = document.querySelector(".nav-list");

    hamburger.addEventListener("click", () => {
        navList.style.display = navList.style.display === "flex" ? "none" : "flex";
    });

    // Ensure nav list displays correctly on resize
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            navList.style.display = "flex"; // Show nav on larger screens
        } else {
            navList.style.display = "none"; // Hide nav by default on smaller screens
        }
    });
});
