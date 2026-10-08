const postKey = "mappin-posts";
const pinColors = ["red", "orange", "purple", "green", "blue"];

function readPosts() {
  const saved = localStorage.getItem(postKey);
  return saved ? JSON.parse(saved) : [];
}

function createMapPost(post) {
  const wrapper = document.createElement("div");
  const color = pinColors.includes(post.color) ? post.color : "red";
  wrapper.className = `map-post map-post--${color}`;
  wrapper.style.left = `${post.x}%`;
  wrapper.style.top = `${post.y}%`;

  const bubble = document.createElement("span");
  bubble.className = "comment-bubble";
  const icon = document.createElement("span");
  icon.className = "comment-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = post.icon || "💬";
  bubble.append(icon, document.createTextNode(post.text));

  const pin = document.createElement("span");
  pin.className = "pin";
  pin.title = post.text;

  wrapper.append(bubble, pin);
  return wrapper;
}

const map = document.getElementById("map");
if (map) {
  readPosts().forEach((post) => {
    if (!post.locationEnabled) return;
    map.append(createMapPost(post));
  });
}

const form = document.getElementById("post-form");
if (form) {
  const postText = document.getElementById("post-text");
  const postNotice = document.getElementById("post-notice");
  const locationState = document.getElementById("location-state");
  const locationToggle = document.getElementById("location-toggle");
  let locationEnabled = true;

  locationToggle.addEventListener("click", () => {
    locationEnabled = !locationEnabled;
    locationState.textContent = locationEnabled ? "オン" : "オフ";
    locationToggle.textContent = locationEnabled ? "位置情報をオフにする" : "位置情報をオンにする";
    locationToggle.setAttribute("aria-pressed", String(locationEnabled));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = postText.value.trim();
    if (!text) {
      postNotice.textContent = "投稿内容を入力してください。";
      postText.focus();
      return;
    }

    const posts = readPosts();
    posts.unshift({
      text,
      locationEnabled,
      color: pinColors[posts.length % pinColors.length],
      icon: "💬",
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60
    });
    localStorage.setItem(postKey, JSON.stringify(posts));
    window.location.href = "index.html";
  });
}
