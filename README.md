ThemeKit v4.0 - The WYSIWYG Web Builder
專案代號: ThemeKit (已進化為視覺化建構器)
版本: 4.0
狀態: 終極版 - 可直接交付架構設計與開發

產品哲學 (Product Philosophy)
Visual is the new Code.

我們賦予創作者用設計的直覺，來建構真實、高效、生產就緒的網頁。ThemeKit v4.0 旨在弭平設計與開發之間的鴻溝，讓視覺創意能無縫轉化為標準、可用的程式碼。

核心理念與用戶情境 (Core Concepts & User Scenarios)
解決的問題:
對設計師: 「我希望能像在 Figma 裡一樣自由設計，但產出的不是一張靜態圖片，而是能直接交付給工程師的、一個真正可以運作的網頁。」
對開發者: 「我希望能有一個視覺化的工具，讓我快速搭建頁面佈局、測試間距與響應式設計，並自動生成乾淨、標準的 HTML 和 CSS，把我從繁瑣的 UI 切版工作中解放出來。」
核心用戶旅程:
設定畫布: 設計師小希進入 ThemeKit，選擇了「桌面 (1440px)」作為她的初始畫布框架 (Frame)。
搭建結構: 她從左側元件庫拖曳一個「容器 (Container)」到畫布上。在右側屬性檢查器中，她將容器的佈局設定為「Flex」，方向為「垂直」，對齊方式為「置中」。
填充內容: 她接著將一個「圖片」和一個「文字標題」拖曳到這個容器裡面。圖片和標題立刻按照她設定的 Flex 邏輯自動垂直置中排列。
精確微調: 她選中標題，在右側檢查器中，將其 margin-top 的數值從 0 改為 24px。畫布上的標題立刻向下移動了 24 像素。
即時驗證: 與此同時，在底部展開的「程式碼面板」中，她能清晰地看到對應的 HTML 結構和 CSS 規則（例如 .container { display: flex; ... } 和 .title { margin-top: 24px; }）被即時、精確地生成。
一鍵交付: 設計完成後，她可以輕鬆複製或匯出整個頁面的 HTML 和 CSS 檔案，直接交給工程師小李。
【核心】視覺畫布 (The Canvas) 的核心邏輯
要確保畫布的視覺呈現與最終程式碼 100% 一致，我們的畫布必須基於真實的前端排版邏輯來運作。

A. 絕對座標與佈局流 (Positioning Model)
基礎: 畫布上的所有元件，都基於 CSS 的標準盒模型 (Box Model)。
預設佈局: 當一個元件被拖曳到另一個容器內部時，它會進入容器的「佈局流 (Layout Flow)」。它的位置將由容器的佈局屬性（如 Flexbox, Grid）來決定，而非絕對座標。
未來擴充 (絕對定位): 未來可在屬性檢查器中，提供一個 position 屬性切換。當用戶明確將一個元件設定為 absolute 或 fixed 時，它才會脫離佈局流，允許用戶在畫布上任意拖曳到指定座標。
B. 佈局引擎 (Layout Engine): 以 Flexbox 為核心
核心元件：「容器 (Container)」: 元件庫中的容器，其本質就是一個 <div>。用戶可以在右側屬性檢查器中，將其 display 屬性輕鬆切換為 flex。
直觀操作: 當容器被設為 flex 時，屬性檢查器會出現一組圖形化的 Flexbox 控制項：
方向 (Direction): 下拉選單選擇 row, column 等。
對齊 (Align & Justify): 下拉選單直觀點選 align-items 和 justify-content 的所有選項。
間距 (Gap): 輸入框讓用戶直接設定子元件之間的間距。
層層相嵌: 用戶可以將一個 Flex 容器，再放入另一個 Flex 容器中，從而構建出無限複雜的、符合真實 Web 開發邏輯的巢狀佈局。
C. 狀態管理：唯一的真相來源 (Single Source of Truth)
這是確保視覺與程式碼同步的技術心臟。整個畫布的內容，被儲存在一個樹狀的 JavaScript 物件中 (canvasState)。任何在 UI 上的操作（如調整樣式、修改文字）都會先更新這個狀態物件，再由 React 根據這個唯一的數據源，同步重新渲染視覺畫布與底部的程式碼面板，從而實現了視覺與程式碼的絕對一致性。

canvasState 數據結構範例:

JavaScript

const canvasState = {
  id: 'root-container',
  component: 'Container',
  styles: { display: 'flex', flexDirection: 'column', ... },
  children: [
    {
      id: 'image-123',
      component: 'Image',
      props: { src: '...' },
      styles: { width: '100px', height: '100px', ... }
    },
    {
      id: 'text-456',
      component: 'Text',
      props: { content: 'Hello World' },
      styles: { marginTop: '24px', color: '#000', ... }
    }
  ]
};
功能亮點 (Features)
所見即所得 (WYSIWYG): 在視覺畫布上的所有操作，都即時反應出最終網頁的樣貌。
元件化架構: 提供容器、文字、圖片、按鈕等基礎元件，可透過拖曳方式快速建構頁面。
強大的屬性檢查器: 精確控制每個元件的佈局 (Flexbox)、尺寸、間距 (Padding/Margin)、文字樣式和內容。
即時程式碼生成: 自動生成乾淨、標準的 HTML 與 CSS，設計與開發無縫接軌。
響應式設計框架: 可在桌面、平板、手機三種畫布尺寸間切換，即時預覽響應式效果。
深色/淺色模式: 內建主題切換功能，並能為深色模式產生對應的 CSS 樣式。
國際化 (i18n): 支援中文 (zh) 與英文 (en) 的介面語言切換。
元件操作: 可輕鬆對畫布中的元件進行上移、下移和刪除。
UI 規格細節
左欄 (元件庫 & 畫布框架):

元件庫: 以卡片形式陳列所有可用元件，用戶可直接拖曳至中欄畫布。
畫布框架: 提供桌面 (Desktop), 平板 (Tablet), 手機 (Mobile) 按鈕，一鍵切換中欄畫布的預覽寬度。
中欄 (視覺畫布):

核心互動區域，用戶在此進行元件的拖放、選取與排列。
選中的元件會以紫色外框高亮，方便識別。
空的容器會顯示提示文字，引導用戶拖入新元件。
右欄 (屬性檢查器):

操作的核心，當用戶選中一個元件時，此處會顯示該元件所有可編輯的屬性。
根據元件類型（如容器、文字）動態顯示不同的屬性區塊。
佈局 (Layout): 核心控制區，提供 display, flex-direction, justify-content 等 CSS 屬性控制。
尺寸 (Size) & 間距 (Spacing): 提供類似 Figma 的輸入框，允許用戶分別設定 width, height, padding, margin 的值。
底部 (程式碼面板):

HTML 頁籤: 透過遞迴遍歷 canvasState 物件樹，生成乾淨的、巢狀的 HTML 程式碼。
CSS 頁籤: 遍歷 canvasState 物件樹，為每一個元件生成一個唯一的 class 名稱（例如 .el-image-123），並將其 styles 物件轉換為對應的 CSS 規則。
技術棧 (Tech Stack)
核心框架: React (v18+)
狀態管理: React Hooks (useState, useEffect, useCallback, useMemo)
圖示庫: Lucide React
樣式: Tailwind CSS (用於建構工具本身 UI)
國際化 (i18n): 自訂 translations 物件實現
安裝與啟動 (Installation and Startup)
複製專案:

Bash

git clone https://your-repository-url.git
cd themekit-v4
安裝依賴:

Bash

npm install
啟動開發伺服器:

Bash

npm start
應用程式將會在 http://localhost:3000 上運行。

未來展望 (Future Roadmap)
這份規格書定義了一個真正強大的、能與業界頂尖工具看齊的平台級產品。它技術挑戰巨大，但一旦實現，其商業價值和市場潛力也將是無可估量的。

擴充元件庫: 增加更多如表單輸入、導航欄、卡片等複雜元件。
支援 Grid 佈局: 在屬性檢查器中增加對 CSS Grid 的視覺化編輯功能。
真實數據綁定: 允許用戶連接 API，將畫布元件與真實數據源綁定。
組件化與重用: 允許用戶將設計好的區塊保存為可重用的「組件」。
程式碼匯出: 提供一鍵下載完整 HTML/CSS 檔案的功能。
協作功能: 引入多人即時協作編輯。
