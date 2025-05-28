// 模擬使用者資料庫（記憶體儲存）
const users = [];

// 當前登入使用者
let currentUser = null;

const authSection = document.getElementById("authSection");
const blogSection = document.getElementById("blogSection");

const authForm = document.getElementById("authForm");
const authMsg = document.getElementById("authMsg");

const form = document.getElementById("moodForm");
const postList = document.getElementById("postList");

const logoutBtn = document.getElementById("logoutBtn");

const posts = []; // 儲存貼文資料

// 登入 / 註冊流程
authForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) return;

  const user = users.find(u => u.username === username);

  if (user) {
    // 已有帳號，檢查密碼
    if (user.password === password) {
      currentUser = user;
      authMsg.textContent = "";
      showBlogSection();
    } else {
      authMsg.textContent = "密碼錯誤！";
    }
  } else {
    // 註冊新帳號
    users.push({ username, password });
    currentUser = { username, password };
    authMsg.textContent = "註冊成功，已登入！";
    showBlogSection();
  }

  authForm.reset();
});

// 顯示心情版區塊
function showBlogSection() {
  authSection.style.display = "none";
  blogSection.style.display = "block";
  renderPosts();
}

// 登出功能
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  authSection.style.display = "block";
  blogSection.style.display = "none";
  postList.innerHTML = "";
});

// 貼文發佈事件（含圖片）
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const tag = document.getElementById("tag").value;
  const imageInput = document.getElementById("imageInput");

  if (!title || !content) return alert("請填寫標題與內容！");

  // 圖片檔案處理（讀取成 base64）
  if (imageInput.files.length > 0) {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      addPost(title, content, tag, event.target.result);
      form.reset();
    };

    reader.readAsDataURL(file);
  } else {
    addPost(title, content, tag, null);
    form.reset();
  }
});

// 新增貼文至列表
function addPost(title, content, tag, imageData) {
  if (!currentUser) return alert("請先登入！");

  const post = {
    username: currentUser.username,
    title,
    content,
    tag,
    imageData,
    createdAt: new Date().toLocaleString()
  };

  posts.unshift(post);
  renderPosts();
}

// 渲染貼文
function renderPosts() {
  postList.innerHTML = "";

  posts.forEach((post) => {
    const postEl = document.createElement("div");
    postEl.className = "post";
    postEl.innerHTML = `
      <h3>${post.title} <small>by ${post.username}</small></h3>
      <p>${post.content}</p>
      <p class="tag">#${post.tag}</p>
      ${post.imageData ? `<img src="${post.imageData}" alt="貼文圖片" />` : ""}
      <small>${post.createdAt}</small>
    `;
    postList.appendChild(postEl);
  });
}
