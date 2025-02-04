## 網站介紹

這是一個提供使用者聆聽歌曲的網站，主要分為三個部分

1. **Top Tracks**: 展示您近期最常聽個歌曲Top10
2. **Recommend**: 根據您聆聽的喜好，推薦10首專屬於你的歌曲
3. **Challenge**: 提供多道題目讓您藉由猜歌曲名字與歌手認識更多的音樂

## 技術

目前網站使用的技術與框架

- **Next.js 14** (React Framework)
- **TypeScript** (Language)
- **Vercel** (架設網站 PaSS)
- **Spotify Web API** (API)
- **OAuth 2.0** (Spotify Login)
- Axios (API串接、前後端溝通)
- Bootstrap (CSS Styling)
- Redis (Rate-Limit Cache)
- Vitest (Unit Test)
- Eslint (提高程式碼編寫效率)
- Prettier (讓程式碼更整潔)
- Google Analytics (分析使用者)
- PWA (用起來就像APP)
- Open Graph (在社群媒體上更帥)
- GPT-4o (小助手)
- Claude (小助手)

## 本地端運行

要在本地端運行這個專案，請按照以下步驟進行：

1. clone 這個 repository：

   ```sh
   git clone https://github.com/lucas6028/daily-song.git
   cd daily-song
   ```

2. 安裝相依套件：

   ```sh
   npm install
   ```

3. 建立 `.env` 檔案並設定環境變數：

   ```sh
   cp .env.example .env
   ```

   編輯 .env 檔案並填入必要的環境變數

   ```
   SECRET_REDIS_PASSWORD=YOUR_REDIS_PASSWORD
   SECRET_CLIENT_SECRET=YOUR_SPOTIFY_CLIENT_SECRET
   NEXT_PUBLIC_CLIENT_ID=YOUR_SPOTIFY_PUBLIC_SECRET
   NEXT_PUBLIC_NODE_ENV=development
   NEXT_PUBLIC_REDIRECT_URL=https://localhost:3000/login
   NEXT_PUBLIC_API_URL=https://localhost:3000/
   SECRET_LASTFM_API_KEY=YOUR_LASTFM_API_KEY
   ```

   Spotify client id 和 secret 可在 Spofity Developer 網站註冊
   Website: [Spotify Developer](https://developer.spotify.com/)

   Last.FM API 可在官網註冊
   Website: [Last.FM](https://www.last.fm/api#getting-started)

4. 啟動開發伺服器：

   ```sh
   npm run dev
   ```

5. 在瀏覽器中開啟 [http://localhost:3000](http://localhost:3000) 查看網站。

## 心得

當初是為了學習網頁API的原理以及運作方式，看到有人推薦 Spotify-API，所以就上網找 Docs 來看。最一開始是做 SPA (Single-page-application)，單純的讓使用者登入 Spotify 帳號並使用 iFrame embembed，並沒有做 OAuth 和儲存 access token。

到了第二版的網站，使用 MERN stack (MongoDB, Express, React, Node.js) 作為架構，將 client 和 server 分開架設，server 的工作主要是接收與發送 API，並向 Spotify API 取得資料。在這版的網站能將 access token 儲存在 server-side cookie，讓使用者可以不需要重複登入。在這版網站碰到了一些問題，包括將 server 架設在 Render 上(免費方案)，所以會有一段延遲。而在 Safari 上也因為不同源問題所以無法存取到 access token，所以進而轉向使用 Next.js 14。

到了第三版的網站，使用 Next.js 14 作為 Full-Stack Framework，將網站架設在 Vercel (Next.js 的開發公司)，解決了 Render 上的延遲時間，也解決 Safari 上的不同源問題。其他網站上的功能延續前一版，再加上一些新功能與美化。

總結來說我在這個 Side Project 中學到許多知識與技巧，包括如何架設網站、如何使用 OAuth、React 的基本功能，API 的串接，server 的運作方式 ......

本網站使用到許多 npm packages，在此感謝多位創作者的開發🙏

## 參考

[目前網站 Source Code (GitHub)](https://github.com/lucas6028/daily-song)

[原網站 Source Code (GitHub)](https://github.com/lucas6028/daily-song-express)
