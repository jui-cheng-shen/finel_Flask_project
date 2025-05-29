// script.js
console.log("部落格頁面已載入！");

// 您可以在此處添加更多 JavaScript 功能，例如：
// - 圖片燈箱效果 (點擊圖片放大)
// - 平滑滾動到頁面特定區塊
// - 互動式元素 (如果未來添加)

document.addEventListener('DOMContentLoaded', () => {
    // 範例：簡單的 DOM 操作，例如在頁尾加上目前年份
    const footer = document.querySelector('footer p');
    if (footer) {
        const currentYear = new Date().getFullYear();
        // footer.textContent += ` © ${currentYear}`; // 可選，如果想加上年份
    }
});