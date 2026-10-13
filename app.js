const postKey = "mappin-posts";
const engagementKey = "mappin-post-engagement";
const followingKey = "mappin-following";
const pinColors = ["red", "orange", "purple", "green", "blue"];
const samplePostTimes = {
  "moon-burger": Date.now() - 2 * 60 * 60 * 1000,
  "chiikawa-goods": Date.now() - 8 * 60 * 60 * 1000,
  "park-flowers": Date.now() - 30 * 60 * 60 * 1000
};
const sampleComments = {
  "moon-burger": [
    { id: "burger-comment-1", author: "ゆう", avatar: "😋", text: "わかる！今年の月見も最高ですね", createdAt: Date.now() - 35 * 60 * 1000, replies: [] },
    { id: "burger-comment-2", author: "mogu", avatar: "🐻", text: "どこのお店ですか？", createdAt: Date.now() - 3 * 60 * 60 * 1000, replies: [] }
  ],
  "chiikawa-goods": [
    { id: "goods-comment-1", author: "ハチワレ推し", avatar: "🐱", text: "情報ありがとうございます！", createdAt: Date.now() - 12 * 60 * 1000, replies: [] },
    { id: "goods-comment-2", author: "かな", avatar: "🐰", text: "何時ごろに見かけましたか？", createdAt: Date.now() - 2 * 60 * 60 * 1000, replies: [] }
  ],
  "park-flowers": [
    { id: "flowers-comment-1", author: "はる", avatar: "🌷", text: "きれいですね。週末に行ってみます！", createdAt: Date.now() - 50 * 60 * 1000, replies: [] }
  ]
};

function formatTimestamp(timestamp) {
  const elapsed = Math.max(0, Date.now() - timestamp);
  if (elapsed < 60 * 1000) return "たった今";
  if (elapsed < 24 * 60 * 60 * 1000) {
    const hours = Math.max(1, Math.floor(elapsed / (60 * 60 * 1000)));
    return `${hours}時間前`;
  }
  const date = new Date(timestamp);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function countComments(comments) {
  return comments.reduce((count, comment) => count + 1 + countComments(comment.replies || []), 0);
}

function addMissingCommentTimes(comments) {
  comments.forEach((comment) => {
    if (!Number(comment.createdAt)) comment.createdAt = Date.now();
    addMissingCommentTimes(comment.replies || []);
  });
}

function readPosts() {
  const saved = localStorage.getItem(postKey);
  return saved ? JSON.parse(saved) : [];
}

function readEngagement() {
  const saved = localStorage.getItem(engagementKey);
  return saved ? JSON.parse(saved) : {};
}

function saveEngagement(engagement) {
  localStorage.setItem(engagementKey, JSON.stringify(engagement));
}

function readFollowing() {
  const saved = localStorage.getItem(followingKey);
  return new Set(saved ? JSON.parse(saved) : []);
}

function createMapPost(post) {
  const wrapper = document.createElement("div");
  const color = pinColors.includes(post.color) ? post.color : "red";
  wrapper.className = `map-post map-post--${color}`;
  wrapper.style.left = `${post.x}%`;
  wrapper.style.top = `${post.y}%`;
  wrapper.dataset.postId = post.id || `saved-${post.x}-${post.y}`;
  wrapper.dataset.locationId = post.locationId || "nearby";
  wrapper.dataset.locationName = post.locationName || "現在地周辺";
  wrapper.dataset.areaId = post.areaId || post.locationId || "nearby";
  wrapper.dataset.areaName = post.areaName || post.locationName || "現在地周辺";
  wrapper.dataset.placeId = post.placeId || "";
  wrapper.dataset.placeName = post.placeName || "";
  wrapper.dataset.category = post.category || "local";
  wrapper.dataset.latitude = post.latitude ?? "";
  wrapper.dataset.longitude = post.longitude ?? "";
  wrapper.dataset.createdAt = String(post.createdAt || Date.now());
  wrapper.dataset.author = post.author || "あなた";
  wrapper.dataset.avatar = post.avatar || "🙂";
  wrapper.dataset.icon = post.icon || "💬";
  wrapper.dataset.photo = post.photo || "";
  wrapper.dataset.likes = String(post.likes || 0);

  const bubble = document.createElement("button");
  bubble.className = "comment-bubble";
  bubble.type = "button";
  const avatar = document.createElement("span");
  avatar.className = "comment-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = post.avatar || "🙂";
  const text = document.createElement("span");
  text.textContent = post.text;
  bubble.append(avatar, text);

  const pin = document.createElement("span");
  pin.className = "pin";
  pin.title = post.text;

  wrapper.append(bubble, pin);
  if (post.mapCount > 1) {
    const count = document.createElement("span");
    count.className = "pin-cluster-count";
    count.textContent = String(post.mapCount);
    count.setAttribute("aria-label", `${post.mapCount}件の投稿`);
    wrapper.append(count);
  }
  return wrapper;
}

const map = document.getElementById("map");
const following = readFollowing();
if (map) {
  const locationGroups = new Map();
  readPosts().filter((post) => post.locationEnabled).forEach((post) => {
    const groupId = post.placeId || post.areaId || post.locationId || `post:${post.id}`;
    const group = locationGroups.get(groupId) || [];
    group.push(post);
    locationGroups.set(groupId, group);
  });
  locationGroups.forEach((posts) => {
    const mostPopular = [...posts].sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0) || Number(b.createdAt || 0) - Number(a.createdAt || 0))[0];
    map.append(createMapPost({ ...mostPopular, mapCount: posts.length }));
  });
}

const overlay = document.getElementById("post-overlay");
if (overlay?.querySelector("#detail-avatar")) {
  const detailAvatar = document.getElementById("detail-avatar");
  const detailAuthor = document.getElementById("detail-author");
  const detailText = document.getElementById("detail-text");
  const detailPhoto = document.getElementById("detail-photo");
  const likeButton = overlay.querySelector('[data-action="like"]');
  const likeCount = document.getElementById("like-count");
  const bookmarkButton = overlay.querySelector('[data-action="bookmark"]');
  const commentCount = document.getElementById("comment-count");
  const postTime = document.getElementById("post-time");
  const commentsList = document.getElementById("comments-list");
  const commentForm = document.getElementById("comment-form");
  const commentInput = document.getElementById("comment-input");
  const replyingTo = document.getElementById("replying-to");
  let currentPost = null;
  let replyTargetId = null;

  function openPost(postElement) {
    currentPost = {
      id: postElement.dataset.postId,
      author: postElement.dataset.author || "ユーザー",
      avatar: postElement.dataset.avatar || "🙂",
      icon: postElement.dataset.icon || "💬",
      text: postElement.querySelector(".comment-bubble span:last-child")?.textContent || "",
      photo: postElement.dataset.photo || "",
      likes: Number(postElement.dataset.likes || 0),
      createdAt: Number(postElement.dataset.createdAt) || samplePostTimes[postElement.dataset.postId] || Date.now()
    };
    const engagement = readEngagement();
    const state = engagement[currentPost.id] || {};
    detailAvatar.textContent = currentPost.avatar;
    detailAuthor.textContent = currentPost.author;
    detailText.textContent = currentPost.text;
    detailPhoto.hidden = !currentPost.photo;
    detailPhoto.textContent = currentPost.photo;
    detailPhoto.setAttribute("aria-label", currentPost.photo ? "投稿写真" : "");
    postTime.dateTime = new Date(currentPost.createdAt).toISOString();
    postTime.textContent = formatTimestamp(currentPost.createdAt);
    likeCount.textContent = String(currentPost.likes + (state.liked ? 1 : 0));
    likeButton.classList.toggle("is-active", Boolean(state.liked));
    likeButton.setAttribute("aria-pressed", String(Boolean(state.liked)));
    bookmarkButton.classList.toggle("is-active", Boolean(state.bookmarked));
    bookmarkButton.setAttribute("aria-pressed", String(Boolean(state.bookmarked)));
    const followButton = document.getElementById("follow-button");
    const isFollowing = following.has(currentPost.author);
    followButton.classList.toggle("is-following", isFollowing);
    followButton.textContent = isFollowing ? "フォロー中" : "フォロー";
    const comments = state.comments || sampleComments[currentPost.id] || [];
    addMissingCommentTimes(comments);
    if (state.comments) saveEngagement(engagement);
    renderComments(comments);
    commentCount.textContent = String(countComments(comments));
    replyTargetId = null;
    replyingTo.hidden = true;
    commentInput.value = "";
    overlay.hidden = false;
    document.body.classList.add("overlay-open");
    document.getElementById("close-overlay").focus();
  }

  function renderComments(comments) {
    commentsList.replaceChildren();
    if (comments.length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "まだコメントはありません。";
      commentsList.append(empty);
      return;
    }

    comments.forEach((comment) => {
      const item = createCommentElement(comment);
      commentsList.append(item);
    });
  }

  function createCommentElement(comment) {
    const item = document.createElement("article");
    item.className = "comment-item";
    const avatar = document.createElement("span");
    avatar.className = "avatar small-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = comment.avatar || "🙂";
    const content = document.createElement("div");
    content.className = "comment-content";
    const author = document.createElement("strong");
    author.textContent = comment.author;
    const time = document.createElement("time");
    time.className = "comment-time";
    const createdAt = Number(comment.createdAt) || Date.now();
    time.dateTime = new Date(createdAt).toISOString();
    time.textContent = formatTimestamp(createdAt);
    const meta = document.createElement("div");
    meta.className = "comment-meta";
    meta.append(author, time);
    const text = document.createElement("p");
    text.textContent = comment.text;
    const replyButton = document.createElement("button");
    replyButton.className = "reply-button";
    replyButton.type = "button";
    replyButton.dataset.replyTo = comment.id;
    replyButton.dataset.replyAuthor = comment.author;
    replyButton.textContent = "返信";
    content.append(meta, text, replyButton);

    if (comment.replies?.length) {
      const replies = document.createElement("div");
      replies.className = "comment-replies";
      comment.replies.forEach((reply) => replies.append(createCommentElement(reply)));
      content.append(replies);
    }
    item.append(avatar, content);
    return item;
  }

  function closePost() {
    overlay.hidden = true;
    document.body.classList.remove("overlay-open");
    currentPost = null;
    replyTargetId = null;
  }

  map?.addEventListener("click", (event) => {
    const bubble = event.target.closest(".comment-bubble");
    if (bubble) openPost(bubble.closest(".map-post"));
  });

  document.getElementById("close-overlay").addEventListener("click", closePost);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closePost();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) closePost();
  });

  document.getElementById("follow-button").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const isFollowing = following.has(currentPost.author);
    if (isFollowing) following.delete(currentPost.author);
    else following.add(currentPost.author);
    localStorage.setItem(followingKey, JSON.stringify([...following]));
    button.classList.toggle("is-following", !isFollowing);
    button.textContent = isFollowing ? "フォロー" : "フォロー中";
  });

  likeButton.addEventListener("click", () => {
    if (!currentPost) return;
    const engagement = readEngagement();
    const state = engagement[currentPost.id] || {};
    state.liked = !state.liked;
    engagement[currentPost.id] = state;
    saveEngagement(engagement);
    likeButton.classList.toggle("is-active", state.liked);
    likeButton.setAttribute("aria-pressed", String(state.liked));
    likeCount.textContent = String(currentPost.likes + (state.liked ? 1 : 0));
  });

  bookmarkButton.addEventListener("click", () => {
    if (!currentPost) return;
    const engagement = readEngagement();
    const state = engagement[currentPost.id] || {};
    state.bookmarked = !state.bookmarked;
    engagement[currentPost.id] = state;
    saveEngagement(engagement);
    bookmarkButton.classList.toggle("is-active", state.bookmarked);
    bookmarkButton.setAttribute("aria-pressed", String(state.bookmarked));
  });

  overlay.addEventListener("click", (event) => {
    const replyButton = event.target.closest("[data-reply-to]");
    if (replyButton) {
      replyTargetId = replyButton.dataset.replyTo;
      replyingTo.textContent = `${replyButton.dataset.replyAuthor} に返信中`;
      replyingTo.hidden = false;
      commentInput.focus();
    }
    if (event.target.closest('[data-action="comment"]')) commentInput.focus();
  });

  commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = commentInput.value.trim();
    if (!text || !currentPost) return;
    const engagement = readEngagement();
    const state = engagement[currentPost.id] || {};
    const comments = state.comments || sampleComments[currentPost.id] || [];
    const comment = {
      id: `comment-${Date.now()}`,
      author: "あなた",
      avatar: "🙂",
      text,
      createdAt: Date.now(),
      replies: []
    };
    if (replyTargetId) {
      const parent = comments.find((item) => item.id === replyTargetId);
      if (parent) parent.replies.push(comment);
      else comments.push(comment);
    } else {
      comments.push(comment);
    }
    state.comments = comments;
    engagement[currentPost.id] = state;
    saveEngagement(engagement);
    renderComments(comments);
    commentCount.textContent = String(countComments(comments));
    commentInput.value = "";
    replyTargetId = null;
    replyingTo.hidden = true;
    commentsList.scrollTop = commentsList.scrollHeight;
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
      id: `post-${Date.now()}`,
      text,
      locationEnabled,
      locationId: "nearby",
      locationName: "現在地周辺",
      category: "local",
      color: pinColors[posts.length % pinColors.length],
      icon: "💬",
      author: "あなた",
      avatar: "🙂",
      createdAt: Date.now(),
      createdAt: Date.now(),
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60
    });
    localStorage.setItem(postKey, JSON.stringify(posts));
    window.location.href = "index.html";
  });
}
