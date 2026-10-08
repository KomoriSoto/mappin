const postKey = "mappin-posts";

function readPosts() {
  const saved = localStorage.getItem(postKey);
  return saved ? JSON.parse(saved) : [];
}

const map = document.getElementById("map");
if (map) {
  readPosts().forEach((post) => {
    if (!post.locationEnabled) return;
    const pin = document.createElement("span");
    pin.className = "pin";
    pin.style.left = `${post.x}%`;
    pin.style.top = `${post.y}%`;
    pin.title = post.text;
    map.append(pin);
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
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60
    });
    localStorage.setItem(postKey, JSON.stringify(posts));
    window.location.href = "index.html";
  });
}
