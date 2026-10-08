(function () {
const feedEngagementKey = "mappin-post-engagement";
const feedPostsKey = "mappin-posts";
const feedFollowingKey = "mappin-following";

const starterComments = {
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

const starterPostTimes = {
  "moon-burger": Date.now() - 2 * 60 * 60 * 1000,
  "chiikawa-goods": Date.now() - 8 * 60 * 60 * 1000,
  "park-flowers": Date.now() - 30 * 60 * 60 * 1000
};

const samePlacePosts = [
  { id: "station-food-2", locationId: "station", areaId: "station-district", placeId: "moon-burger-shop", locationName: "駅前エリア", placeName: "駅前のハンバーガー店", category: "food", author: "ランチ部", avatar: "🍜", text: "駅前のハンバーガー店、ポテトもおいしい", photo: "🍜", likes: 42, createdAt: Date.now() - 4 * 60 * 60 * 1000 },
  { id: "station-food-3", locationId: "station", areaId: "station-district", placeId: "station-cafe", locationName: "駅前エリア", placeName: "駅前カフェ", category: "food", author: "あき", avatar: "🍰", text: "改札横のカフェ、席が空いてます", photo: "☕", likes: 18, createdAt: Date.now() - 90 * 60 * 1000 },
  { id: "station-food-4", locationId: "station", areaId: "station-district", locationName: "駅前エリア", category: "food", author: "たろう", avatar: "🍛", text: "新しいカレー屋さんがオープンしてた！", likes: 7, createdAt: Date.now() - 28 * 60 * 60 * 1000 },
  { id: "shopping-2", locationId: "shopping", areaId: "station-district", locationName: "駅前ショッピングエリア", category: "shopping", author: "お買いものメモ", avatar: "🧸", text: "限定グッズ、入口近くの棚にありました", photo: "🎁", likes: 56, createdAt: Date.now() - 45 * 60 * 1000 },
  { id: "shopping-3", locationId: "shopping", areaId: "station-district", locationName: "駅前ショッピングエリア", category: "shopping", author: "みな", avatar: "🐣", text: "今日は店内ゆっくり見られそうです", likes: 11, createdAt: Date.now() - 5 * 60 * 60 * 1000 },
  { id: "shopping-4", locationId: "shopping", areaId: "station-district", locationName: "駅前ショッピングエリア", category: "shopping", author: "グッズ好き", avatar: "🛍️", text: "レジは2階の方が空いていました", likes: 6, createdAt: Date.now() - 26 * 60 * 60 * 1000 },
  { id: "park-2", locationId: "park", areaId: "central-park", locationName: "中央公園", category: "nature", author: "そら", avatar: "🐦", text: "池のまわりの桜も咲き始めています", photo: "🌸", likes: 31, createdAt: Date.now() - 3 * 60 * 60 * 1000 },
  { id: "park-3", locationId: "park", areaId: "central-park", locationName: "中央公園", category: "nature", author: "公園さんぽ", avatar: "🧢", text: "ベンチが空いていて気持ちいいです", likes: 15, createdAt: Date.now() - 80 * 60 * 1000 },
  { id: "park-4", locationId: "park", areaId: "central-park", locationName: "中央公園", category: "nature", author: "りん", avatar: "🌼", text: "遊歩道の花壇が見ごろでした", photo: "🌷", likes: 9, createdAt: Date.now() - 25 * 60 * 60 * 1000 }
];

const relatedPosts = {
  food: [
    { id: "related-food-1", category: "food", author: "ごはん記録", avatar: "🍱", text: "近くの商店街でおいしい定食を見つけました", photo: "🍱", likes: 22 },
    { id: "related-food-2", category: "food", author: "おやつ時間", avatar: "🍮", text: "このあたりの新しいスイーツのお店おすすめです", likes: 13 }
  ],
  shopping: [
    { id: "related-shopping-1", category: "shopping", author: "街のお買いもの情報", avatar: "🛒", text: "近くのお店で週末セールが始まるそうです", likes: 20 },
    { id: "related-shopping-2", category: "shopping", author: "雑貨好き", avatar: "🧺", text: "駅の反対側に新しい雑貨屋さんができていました", likes: 12 }
  ],
  nature: [
    { id: "related-nature-1", category: "nature", author: "季節の風景", avatar: "🌱", text: "この近くの遊歩道も緑がきれいです", photo: "🌿", likes: 19 },
    { id: "related-nature-2", category: "nature", author: "週末さんぽ", avatar: "🚶", text: "周辺を散歩するのにちょうどいい天気です", likes: 10 }
  ],
  local: [
    { id: "related-local-1", category: "local", author: "まちの情報", avatar: "📍", text: "近くで新しいお店を見つけました", likes: 8 }
  ]
};

function readFeedEngagement() {
  return JSON.parse(localStorage.getItem(feedEngagementKey) || "{}");
}

function saveFeedEngagement(value) {
  localStorage.setItem(feedEngagementKey, JSON.stringify(value));
}

function feedTime(timestamp) {
  const elapsed = Math.max(0, Date.now() - timestamp);
  if (elapsed < 60_000) return "たった今";
  if (elapsed < 86_400_000) return `${Math.max(1, Math.floor(elapsed / 3_600_000))}時間前`;
  const date = new Date(timestamp);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function totalFeedComments(comments) {
  return comments.reduce((count, comment) => count + 1 + totalFeedComments(comment.replies || []), 0);
}

function feedCommentCount(comments) {
  return totalFeedComments(comments);
}

function createFeedComment(comment) {
  if (!Number(comment.createdAt)) comment.createdAt = Date.now();
  const wrapper = document.createElement("article");
  wrapper.className = "feed-comment";
  const avatar = document.createElement("span");
  avatar.className = "avatar small-avatar";
  avatar.textContent = comment.avatar || "🙂";
  const body = document.createElement("div");
  body.className = "feed-comment-body";
  const meta = document.createElement("div");
  meta.className = "feed-comment-meta";
  const author = document.createElement("strong");
  author.textContent = comment.author;
  const time = document.createElement("time");
  time.textContent = feedTime(comment.createdAt);
  meta.append(author, time);
  const text = document.createElement("p");
  text.textContent = comment.text;
  const replyButton = document.createElement("button");
  replyButton.className = "feed-reply-button";
  replyButton.type = "button";
  replyButton.dataset.feedReplyId = comment.id;
  replyButton.dataset.feedReplyAuthor = comment.author;
  replyButton.textContent = "返信";
  body.append(meta, text, replyButton);
  if (comment.replies?.length) {
    const replies = document.createElement("div");
    replies.className = "feed-replies";
    comment.replies.forEach((reply) => replies.append(createFeedComment(reply)));
    body.append(replies);
  }
  wrapper.append(avatar, body);
  return wrapper;
}

function makeFeedPostElement(post) {
  const engagement = readFeedEngagement();
  const state = engagement[post.id] || {};
  const comments = state.comments || starterComments[post.sourceId || post.id] || [];
  const item = document.createElement("article");
  item.className = "feed-post";
  item.dataset.postId = post.id;
  item.dataset.sourceId = post.sourceId || post.id;
  item.dataset.author = post.author;
  item.dataset.placeId = post.placeId || "";
  item.dataset.placeName = post.placeName || "";

  const header = document.createElement("div");
  header.className = "feed-post-header";
  const avatar = document.createElement("span");
  avatar.className = "avatar";
  avatar.textContent = post.avatar || "🙂";
  const identity = document.createElement("div");
  identity.className = "feed-post-identity";
  const author = document.createElement("strong");
  author.textContent = post.author;
  if (post.placeId && post.placeName) {
    const location = document.createElement("button");
    location.className = "feed-place";
    location.type = "button";
    location.dataset.feedPlaceId = post.placeId;
    location.dataset.feedPlaceName = post.placeName;
    location.textContent = post.placeName;
    identity.append(author, location);
  } else {
    const location = document.createElement("span");
    location.textContent = post.locationName || "関連する投稿";
    identity.append(author, location);
  }
  const follow = document.createElement("button");
  follow.className = "feed-follow";
  follow.type = "button";
  const following = new Set(JSON.parse(localStorage.getItem(feedFollowingKey) || "[]"));
  const isFollowing = following.has(post.author);
  follow.classList.toggle("is-following", isFollowing);
  follow.textContent = isFollowing ? "フォロー中" : "フォロー";
  header.append(avatar, identity, follow);

  const text = document.createElement("p");
  text.className = "feed-post-text";
  text.textContent = post.text;
  item.append(header, text);

  if (post.photo) {
    const photo = document.createElement("div");
    photo.className = "feed-post-photo";
    photo.setAttribute("role", "img");
    photo.setAttribute("aria-label", "投稿写真");
    photo.textContent = post.photo;
    item.append(photo);
  }

  const actions = document.createElement("div");
  actions.className = "feed-post-actions";
  actions.innerHTML = `
    <button type="button" data-feed-action="comment" aria-label="コメント"><span aria-hidden="true">▢</span><span>${feedCommentCount(comments)}</span></button>
    <button type="button" data-feed-action="like" aria-label="いいね" aria-pressed="${Boolean(state.liked)}" class="${state.liked ? "is-active" : ""}"><span aria-hidden="true">♡</span><span>${Number(post.likes || 0) + (state.liked ? 1 : 0)}</span></button>
    <button type="button" data-feed-action="bookmark" aria-label="保存" aria-pressed="${Boolean(state.bookmarked)}" class="${state.bookmarked ? "is-active" : ""}"><span aria-hidden="true">♧</span></button>
    <time>${feedTime(post.createdAt)}</time>`;
  item.append(actions);

  const commentsSection = document.createElement("section");
  commentsSection.className = "feed-comments";
  commentsSection.setAttribute("aria-label", "投稿へのコメント");
  commentsSection.hidden = true;
  const commentsList = document.createElement("div");
  commentsList.className = "feed-comments-list";
  comments.forEach((comment) => commentsList.append(createFeedComment(comment)));
  commentsSection.append(commentsList);

  const replying = document.createElement("p");
  replying.className = "feed-replying";
  replying.hidden = true;
  const form = document.createElement("form");
  form.className = "feed-comment-form";
  form.hidden = true;
  form.innerHTML = `<input maxlength="280" placeholder="この投稿にコメント..." aria-label="この投稿にコメント"><button type="submit">送信</button>`;
  commentsSection.append(replying, form);
  item.append(commentsSection);
  return item;
}

const overlay = document.getElementById("post-overlay");
const map = document.getElementById("map");
if (overlay && map) {
  const feedTitle = document.getElementById("feed-title");
  const feedBack = document.getElementById("feed-back");
  const feedPosts = document.getElementById("feed-posts");
  const feedScroll = document.getElementById("feed-scroll");
  let orderedPosts = [];
  let renderedCount = 0;
  let loading = false;
  let areaPosts = [];
  let areaScrollTop = 0;
  let areaRenderedCount = 0;
  let inPlaceView = false;

  function postFromMapElement(element) {
    return {
      id: element.dataset.postId,
      sourceId: element.dataset.postId,
      locationId: element.dataset.locationId || "nearby",
      locationName: element.dataset.locationName || "現在地周辺",
      areaId: element.dataset.areaId || element.dataset.locationId || "nearby",
      areaName: element.dataset.areaName || element.dataset.locationName || "現在地周辺",
      placeId: element.dataset.placeId || "",
      placeName: element.dataset.placeName || "",
      category: element.dataset.category || "local",
      author: element.dataset.author || "ユーザー",
      avatar: element.dataset.avatar || "🙂",
      text: element.querySelector(".comment-bubble span:last-child")?.textContent || "",
      photo: element.dataset.photo || "",
      likes: Number(element.dataset.likes || 0),
      latitude: Number(element.dataset.latitude) || null,
      longitude: Number(element.dataset.longitude) || null,
      createdAt: Number(element.dataset.createdAt) || starterPostTimes[element.dataset.postId] || Date.now()
    };
  }

  function distanceInMeters(first, second) {
    if (first.latitude === null || first.longitude === null || second.latitude === null || second.longitude === null) return Infinity;
    const radians = (degrees) => degrees * Math.PI / 180;
    const latitudeDelta = radians(second.latitude - first.latitude);
    const longitudeDelta = radians(second.longitude - first.longitude);
    const value = Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(radians(first.latitude)) * Math.cos(radians(second.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
    return 6371000 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  }

  function getLocationPosts(anchor) {
    const stored = JSON.parse(localStorage.getItem(feedPostsKey) || "[]")
      .filter((post) => post.locationEnabled)
      .map((post) => ({ ...post, sourceId: post.id }));
    const candidates = [anchor, ...samePlacePosts, ...stored.filter((post) => post.id !== anchor.id)];
    let samePlace = candidates.filter((post) => {
      if (post.id === anchor.id) return true;
      if (post.areaId && anchor.areaId && post.areaId === anchor.areaId) return true;
      return distanceInMeters(anchor, post) <= 250;
    });
    samePlace = samePlace.map((post) => ({
      ...post,
      locationName: post.placeName || post.locationName || anchor.placeName || anchor.areaName || anchor.locationName
    }));
    const posts = [...new Map(samePlace.map((post) => [post.id, post])).values()];
    if (posts.length < 3) {
      const related = (relatedPosts[anchor.category] || relatedPosts.local)
        .filter((post) => !posts.some((existing) => existing.id === post.id))
        .map((post) => ({
        ...post,
        isRelated: true,
        locationName: "近くの関連投稿",
        createdAt: Date.now() - 6 * 60 * 60 * 1000
      }));
      posts.push(...related);
    }
    const rest = posts.filter((post) => post.id !== anchor.id)
      .sort((a, b) => Number(Boolean(a.isRelated)) - Number(Boolean(b.isRelated))
      || Number(b.likes || 0) - Number(a.likes || 0)
      || b.createdAt - a.createdAt);
    return [anchor, ...rest];
  }

  function getPlacePosts(placeId, placeName) {
    const stored = JSON.parse(localStorage.getItem(feedPostsKey) || "[]")
      .filter((post) => post.locationEnabled)
      .map((post) => ({ ...post, sourceId: post.id }));
    const candidates = [...orderedPosts, ...samePlacePosts, ...stored];
    const posts = [...new Map(candidates
      .filter((post) => post.placeId === placeId)
      .map((post) => [post.id, {
        ...post,
        placeName: post.placeName || placeName,
        locationName: post.placeName || placeName
      }])).values()];
    return posts.sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0)
      || Number(b.createdAt || 0) - Number(a.createdAt || 0));
  }

  function renderFeed(posts, title, canGoBack = false) {
    orderedPosts = posts;
    renderedCount = 0;
    feedTitle.textContent = title;
    feedBack.disabled = !canGoBack;
    feedPosts.replaceChildren();
    feedScroll.scrollTop = 0;
    appendNextPage();
  }

  function appendNextPage() {
    if (loading || !orderedPosts.length) return;
    loading = true;
    const pageSize = 4;
    const count = renderedCount < orderedPosts.length
      ? Math.min(pageSize, orderedPosts.length - renderedCount)
      : pageSize;
    for (let index = 0; index < count; index += 1) {
      const absoluteIndex = renderedCount + index;
      const source = orderedPosts[absoluteIndex % orderedPosts.length];
      const post = absoluteIndex < orderedPosts.length
        ? source
        : { ...source, id: `${source.id}-more-${Math.floor(absoluteIndex / orderedPosts.length)}` };
      feedPosts.append(makeFeedPostElement(post));
    }
    renderedCount += count;
    loading = false;
  }

  function findFeedComment(comments, targetId) {
    for (const comment of comments) {
      if (comment.id === targetId) return comment;
      const nested = findFeedComment(comment.replies || [], targetId);
      if (nested) return nested;
    }
    return null;
  }

  function openLocation(anchorElement) {
    const anchor = postFromMapElement(anchorElement);
    areaPosts = getLocationPosts(anchor);
    areaScrollTop = 0;
    areaRenderedCount = 0;
    inPlaceView = false;
    renderFeed(areaPosts, "このエリアの投稿");
    overlay.hidden = false;
    document.body.classList.add("overlay-open");
    document.getElementById("close-overlay").focus();
  }

  function openPlace(placeId, placeName) {
    if (!inPlaceView) {
      areaScrollTop = feedScroll.scrollTop;
      areaRenderedCount = renderedCount;
    }
    inPlaceView = true;
    renderFeed(getPlacePosts(placeId, placeName), `${placeName}の投稿`, true);
  }

  function returnToArea() {
    if (!inPlaceView) return;
    inPlaceView = false;
    renderFeed(areaPosts, "このエリアの投稿");
    while (renderedCount < areaRenderedCount) appendNextPage();
    feedScroll.scrollTop = areaScrollTop;
  }

  map.addEventListener("click", (event) => {
    const bubble = event.target.closest(".comment-bubble");
    const post = bubble?.closest(".map-post");
    if (post) openLocation(post);
  });

  function closeFeed() {
    overlay.hidden = true;
    document.body.classList.remove("overlay-open");
  }

  document.getElementById("close-overlay").addEventListener("click", closeFeed);
  feedBack.addEventListener("click", returnToArea);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeFeed();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) closeFeed();
  });

  feedScroll.addEventListener("scroll", () => {
    if (feedScroll.scrollTop + feedScroll.clientHeight >= feedScroll.scrollHeight - 180) appendNextPage();
  });

  feedPosts.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const item = button.closest(".feed-post");
    if (!item) return;
    const replyId = button.dataset.feedReplyId;
    if (replyId) {
      const form = item.querySelector(".feed-comment-form");
      form.hidden = false;
      form.dataset.replyTo = replyId;
      const replying = item.querySelector(".feed-replying");
      replying.textContent = `${button.dataset.feedReplyAuthor} に返信中`;
      replying.hidden = false;
      form.querySelector("input").focus();
      return;
    }
    const placeId = button.dataset.feedPlaceId;
    if (placeId) {
      const placeName = button.dataset.feedPlaceName || "このお店";
      openPlace(placeId, placeName);
      return;
    }
    const engagement = readFeedEngagement();
    const id = item.dataset.postId;
    const state = engagement[id] || {};

    if (button.classList.contains("feed-follow")) {
      const following = new Set(JSON.parse(localStorage.getItem(feedFollowingKey) || "[]"));
      const nowFollowing = !following.has(item.dataset.author);
      if (nowFollowing) following.add(item.dataset.author);
      else following.delete(item.dataset.author);
      localStorage.setItem(feedFollowingKey, JSON.stringify([...following]));
      button.classList.toggle("is-following", nowFollowing);
      button.textContent = nowFollowing ? "フォロー中" : "フォロー";
      return;
    }

    const action = button.dataset.feedAction;
    if (action === "like" || action === "bookmark") {
      const field = action === "like" ? "liked" : "bookmarked";
      state[field] = !state[field];
      engagement[id] = state;
      saveFeedEngagement(engagement);
      button.classList.toggle("is-active", state[field]);
      button.setAttribute("aria-pressed", String(state[field]));
      if (action === "like") {
        const post = orderedPosts.find((candidate) => candidate.id === item.dataset.sourceId);
        button.lastElementChild.textContent = String(Number(post?.likes || 0) + (state.liked ? 1 : 0));
      }
    }

    if (action === "comment") {
      const section = item.querySelector(".feed-comments");
      const isExpanded = !section.hidden;
      section.hidden = isExpanded;
      if (!isExpanded) {
        const form = section.querySelector(".feed-comment-form");
        form.hidden = false;
        form.querySelector("input").focus();
      }
    }
  });

  feedPosts.addEventListener("submit", (event) => {
    const form = event.target.closest(".feed-comment-form");
    if (!form) return;
    event.preventDefault();
    const input = form.querySelector("input");
    const text = input.value.trim();
    if (!text) return;
    const item = form.closest(".feed-post");
    const engagement = readFeedEngagement();
    const state = engagement[item.dataset.postId] || {};
    const comments = state.comments || starterComments[item.dataset.sourceId] || [];
    const comment = {
      id: `comment-${Date.now()}`,
      author: "あなた",
      avatar: "🙂",
      text,
      createdAt: Date.now(),
      replies: []
    };
    const parent = form.dataset.replyTo ? findFeedComment(comments, form.dataset.replyTo) : null;
    if (parent) parent.replies.push(comment);
    else comments.push(comment);
    state.comments = comments;
    engagement[item.dataset.postId] = state;
    saveFeedEngagement(engagement);
    item.replaceWith(makeFeedPostElement({
      ...orderedPosts.find((post) => post.id === item.dataset.sourceId),
      id: item.dataset.postId,
      sourceId: item.dataset.sourceId
    }));
    const newItem = feedPosts.querySelector(`[data-post-id="${CSS.escape(item.dataset.postId)}"]`);
    if (newItem) {
      newItem.querySelector(".feed-comments").hidden = false;
      const newForm = newItem.querySelector(".feed-comment-form");
      newForm.hidden = false;
      newForm.querySelector("input").focus();
    }
  });
}
})();
