// 獲取回到頂部按鈕
let scrollToTopBtn = document.getElementById("scrollToTopBtn");

// 當使用者捲動頁面20px時顯示按鈕
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 ||  document.documentElement.scrollTop > 20){
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

// 當使用者點擊按鈕時，捲動到頁面頂部
function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// 平滑捲動到錨點
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});