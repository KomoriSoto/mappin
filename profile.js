// プロフィール・投稿編集・お気に入り一覧・フォロー一覧で使う共通の処理
const profilePostsKey = "mappin-posts";
const profileEngagementKey = "mappin-post-engagement";
const profileFollowingKey = "mappin-following";
const profileKey = "mappin-profile";

// マップ（index.html / feed.js）に最初から出ているサンプル投稿。お気に入りに保存されたときに中身を表示するために使う
const samplePosts = [
  { id: "moon-burger", author: "たべもの好き", avatar: "🍟", text: "月見バーガーうめぇ", photo: "🍔", locationName: "駅前エリア", likes: 10, createdAt: Date.now() - 2 * 60 * 60 * 1000 },
  { id: "chiikawa-goods", author: "ちいかわ情報局", avatar: "🐰", text: "ちいかわのコラボグッズまだあります", photo: "🛍️", locationName: "駅前ショッピングエリア", likes: 24, createdAt: Date.now() - 8 * 60 * 60 * 1000 },
  { id: "park-flowers", author: "さんぽ日和", avatar: "🌿", text: "公園の花が咲いています", photo: "", locationName: "中央公園", likes: 8, createdAt: Date.now() - 30 * 60 * 60 * 1000 },
  { id: "station-food-2", author: "ランチ部", avatar: "🍜", text: "駅前のハンバーガー店、ポテトもおいしい", photo: "🍜", locationName: "駅前のハンバーガー店", likes: 42, createdAt: Date.now() - 4 * 60 * 60 * 1000 },
  { id: "station-food-3", author: "あき", avatar: "🍰", text: "改札横のカフェ、席が空いてます", photo: "☕", locationName: "駅前カフェ", likes: 18, createdAt: Date.now() - 90 * 60 * 1000 },
  { id: "station-food-4", author: "たろう", avatar: "🍛", text: "新しいカレー屋さんがオープンしてた！", photo: "", locationName: "駅前エリア", likes: 7, createdAt: Date.now() - 28 * 60 * 60 * 1000 },
  { id: "shopping-2", author: "お買いものメモ", avatar: "🧸", text: "限定グッズ、入口近くの棚にありました", photo: "🎁", locationName: "駅前ショッピングエリア", likes: 56, createdAt: Date.now() - 45 * 60 * 1000 },
  { id: "shopping-3", author: "みな", avatar: "🐣", text: "今日は店内ゆっくり見られそうです", photo: "", locationName: "駅前ショッピングエリア", likes: 11, createdAt: Date.now() - 5 * 60 * 60 * 1000 },
  { id: "shopping-4", author: "グッズ好き", avatar: "🛍️", text: "レジは2階の方が空いていました", photo: "", locationName: "駅前ショッピングエリア", likes: 6, createdAt: Date.now() - 26 * 60 * 60 * 1000 },
  { id: "park-2", author: "そら", avatar: "🐦", text: "池のまわりの桜も咲き始めています", photo: "🌸", locationName: "中央公園", likes: 31, createdAt: Date.now() - 3 * 60 * 60 * 1000 },
  { id: "park-3", author: "公園さんぽ", avatar: "🧢", text: "ベンチが空いていて気持ちいいです", photo: "", locationName: "中央公園", likes: 15, createdAt: Date.now() - 80 * 60 * 1000 },
  { id: "park-4", author: "りん", avatar: "🌼", text: "遊歩道の花壇が見ごろでした", photo: "🌷", locationName: "中央公園", likes: 9, createdAt: Date.now() - 25 * 60 * 60 * 1000 },
  { id: "related-food-1", author: "ごはん記録", avatar: "🍱", text: "近くの商店街でおいしい定食を見つけました", photo: "🍱", locationName: "近くの関連投稿", likes: 22, createdAt: Date.now() - 6 * 60 * 60 * 1000 },
  { id: "related-food-2", author: "おやつ時間", avatar: "🍮", text: "このあたりの新しいスイーツのお店おすすめです", photo: "", locationName: "近くの関連投稿", likes: 13, createdAt: Date.now() - 6 * 60 * 60 * 1000 },
  { id: "related-shopping-1", author: "街のお買いもの情報", avatar: "🛒", text: "近くのお店で週末セールが始まるそうです", photo: "", locationName: "近くの関連投稿", likes: 20, createdAt: Date.now() - 6 * 60 * 60 * 1000 },
  { id: "related-shopping-2", author: "雑貨好き", avatar: "🧺", text: "駅の反対側に新しい雑貨屋さんができていました", photo: "", locationName: "近くの関連投稿", likes: 12, createdAt: Date.now() - 6 * 60 * 60 * 1000 },
  { id: "related-nature-1", author: "季節の風景", avatar: "🌱", text: "この近くの遊歩道も緑がきれいです", photo: "🌿", locationName: "近くの関連投稿", likes: 19, createdAt: Date.now() - 6 * 60 * 60 * 1000 },
  { id: "related-nature-2", author: "週末さんぽ", avatar: "🚶", text: "周辺を散歩するのにちょうどいい天気です", photo: "", locationName: "近くの関連投稿", likes: 10, createdAt: Date.now() - 6 * 60 * 60 * 1000 },
  { id: "related-local-1", author: "まちの情報", avatar: "📍", text: "近くで新しいお店を見つけました", photo: "", locationName: "近くの関連投稿", likes: 8, createdAt: Date.now() - 6 * 60 * 60 * 1000 }
];

// フォロワーはまだ保存先がないので、デモ用の固定データ
const sampleFollowers = [
  { author: "ちいかわ情報局", avatar: "🐰", bio: "駅前のグッズ情報を毎日投稿" },
  { author: "そら", avatar: "🐦", bio: "公園と空の写真が好き" },
  { author: "ランチ部", avatar: "🍜", bio: "駅前ランチ開拓中" },
  { author: "みな", avatar: "🐣", bio: "" }
];

function readJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readMyPosts() {
  return readJson(profilePostsKey, []);
}

function saveMyPosts(posts) {
  writeJson(profilePostsKey, posts);
}

function readProfile() {
  const saved = readJson(profileKey, null) || {};
  return {
    name: saved.name || "ゲストユーザー",
    email: saved.email || "",
    profileText: saved.profile_text || "",
    icon: saved.icon || ""
  };
}

function readFollowingList() {
  return readJson(profileFollowingKey, []);
}

function saveFollowingList(list) {
  writeJson(profileFollowingKey, list);
}

function readEngagementMap() {
  return readJson(profileEngagementKey, {});
}

function saveEngagementMap(value) {
  writeJson(profileEngagementKey, value);
}

// 自分の投稿とサンプル投稿の中からIDで探す
function findAnyPost(id) {
  const mine = readMyPosts().find((post) => post.id === id);
  if (mine) {
    const profile = readProfile();
    return { ...mine, author: profile.name, avatar: profile.icon || [...profile.name][0] };
  }
  return samplePosts.find((post) => post.id === id) || null;
}

// 投稿者名からアイコンを探す（フォロー一覧で使う）
function findAvatar(author) {
  const post = samplePosts.find((candidate) => candidate.author === author)
    || sampleFollowers.find((candidate) => candidate.author === author);
  return post ? post.avatar : "🙂";
}

function profileTime(timestamp) {
  const elapsed = Math.max(0, Date.now() - Number(timestamp || 0));
  if (elapsed < 60_000) return "たった今";
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}分前`;
  if (elapsed < 86_400_000) return `${Math.floor(elapsed / 3_600_000)}時間前`;
  const date = new Date(Number(timestamp));
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

// アバター要素をつくる（画像アイコンがあれば画像、なければ文字や絵文字）
function createAvatar(content, className = "avatar") {
  const avatar = document.createElement("span");
  avatar.className = className;
  avatar.setAttribute("aria-hidden", "true");
  if (content && content.startsWith("data:")) {
    const img = document.createElement("img");
    img.src = content;
    img.alt = "";
    avatar.append(img);
  } else {
    avatar.textContent = content || "🙂";
    // 名前の頭文字（絵文字ではない1文字）のときは青い丸にする
    if (/^\p{L}$/u.test(avatar.textContent)) avatar.classList.add("avatar-initial");
  }
  return avatar;
}

// 画面下に一瞬だけメッセージを出す
function showProfileToast(message) {
  const toast = document.querySelector("#profileToast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showProfileToast.timer);
  showProfileToast.timer = setTimeout(() => toast.classList.remove("visible"), 2200);
}

// 前の画面から渡されたメッセージ（例: 投稿を削除しました）を表示する
function showPendingToast() {
  const message = sessionStorage.getItem("mappin-toast");
  if (!message) return;
  sessionStorage.removeItem("mappin-toast");
  showProfileToast(message);
}

function goWithToast(url, message) {
  sessionStorage.setItem("mappin-toast", message);
  window.location.href = url;
}
