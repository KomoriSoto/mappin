# mappin

# スマートフォンで使う
このアプリはPWAに対応しています。HTTPSで公開したURLをスマートフォンで開き、ブラウザーのメニューから「ホーム画面に追加」を選ぶと、アプリのように全画面で起動できます。

- iPhone / iPad: Safariの共有メニューから「ホーム画面に追加」
- Android: Chromeのメニューから「アプリをインストール」または「ホーム画面に追加」
- PCで確認する場合: プロジェクトフォルダーでローカルWebサーバーを起動し、`http://localhost` のURLを開く

`file://` でHTMLを直接開いた場合や、HTTPSではない別の端末からのアクセスでは、PWAインストールとService Workerによるオフライン表示は利用できません。

# 更新のかけ方
git add .
git commin -m 'メッセージを入力'
git push

# 他の人の更新を反映
git add .
git commin -m 'メッセージを入力'
git pull