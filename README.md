# 簡易記帳軟體
## Getting Start
這是簡易記帳軟體，使用者可以透過此軟體記錄自己的收支情況。

此專案使用react 與 next.js 開發，並以sqlite 作為資料庫。

## How to use
```bash
docker build -t accounting-app .
docker run -p 3000:3000 accounting-app 
```
接著在瀏覽器打開 `http://localhost:3000` 即可使用。

## 介面
這是看全部月份消費的介面，使用者可以在此介面查看每個月的收支情況。
![alt text](image/image.png)

這是可以看單一月份消費的介面，使用者可以在此介面查看單一月份的收支情況。
![alt text](image/image-1.png)
