const PORT = 8000;
const webSocketServer = require("websocket").server;
const http = require("http");

//建立一個port為8000的 http->server
const server = http.createServer();
server.listen(PORT);
console.log("listening port 8000");

//建立webSocket的server
const wsServer = new webSocketServer({
  httpServer: server,
});

//建立客戶端
const clients = {};

//隨機生成UUID的亂碼 EX: 550e8400-e29b (16進位)
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

//連線近來的client 創建一個ID
wsServer.on("request", function (request) {
  let userID = getUniqueID();
  console.log(new Date() + "new connection" + request.origin + "/");

  //建立socket的新連線
  const connection = request.accept(null, request.origin);

  //客戶端 進來 已連線的socket
  clients[userID] = connection;
  console.log(
    "connected: " + userID + "  in  " + Object.getOwnPropertyNames(clients)
  );

  //處理傳送過來的訊息
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("received message :", message.utf8Data);

      //將傳送來的訊息轉發給有連進來的每個客戶端
      for (key in clients) {
        clients[key].sendUTF(message.utf8Data);
        console.log("send message to: " + clients[key]);
      }
    }
  });
});

//--------------------------------------------------------------------------------------------------------------------------

// const express = require("express");
// const app = express();

// //將 express 放進 http 中開啟 Server 的 3000 port ，正確開啟後會在 console 中印出訊息
// const server = require("http")
//   .Server(app)
//   .listen(3000, () => {
//     console.log("open server! 3000");
//   });

// //將啟動的 Server 送給 socket.io 處理
// // const io = require("socket.io")(server);

// // 上方為此寫法的簡寫：
// const socket = require("socket.io");
// const io = socket(server, {
//   cors: {
//     origin: "http://localhost:3001",
//     methods: ["GET", "POST"],
//   },
// });

// //監聽 Server 連線後的所有事件，並捕捉事件 socket 執行
// io.on("connection", (socket) => {
//   //經過連線後在 console 中印出訊息
//   console.log("success connect!");
//   //監聽透過 connection 傳進來的事件
//   socket.on("getMessage", (message) => {
//     //回傳 message 給發送訊息的 Client
//     socket.emit("getMessage", message);
//   });
// });
