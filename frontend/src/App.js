import ReactDom from "react-dom";
import React, { Component } from "react";
import { w3cwebsocket as W3CWebsocket } from "websocket";
import { Card, Avatar, Input, Typography } from "antd";
import "antd/dist/antd.css";
import "./App.css";

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;
const client = new W3CWebsocket("ws://127.0.0.1:8000");

class App extends Component {
  //
  state = {
    userName: "",
    isLoggedIn: false,
    messages: [],
  };

  onButtonClicked = (value) => {
    client.send(
      JSON.stringify({
        type: "message",
        msg: value,
        user: this.state.userName,
      })
    );
    //送出訊息後input框清空
    this.setState({ searchVal: "" });
  };

  componentDidMount() {
    //與port:8000連線
    client.onopen = () => {
      console.log("webSocket Client Connected");
    };
    //
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log("got it! ", dataFromServer);
      //
      if (dataFromServer.type === "message") {
        this.setState((state) => ({
          messages: [
            ...state.messages,
            { msg: dataFromServer.msg, user: dataFromServer.user },
          ],
        }));
      }
    };
  }
  render() {
    return (
      <div className="main">
        {this.state.isLoggedIn ? (
          <div>
            <div className="title">
              <Text
                type="secondary"
                style={{ fontSize: "36px", color: "white" }}
              >
                WebSocket Hi! {this.state.userName}
              </Text>
            </div>
            <div className="chatBox" id="messages">
              {this.state.messages.map((message) => (
                <Card
                  key={message.msg}
                  className="card"
                  style={{
                    alignSelf:
                      this.state.userName === message.user
                        ? "flex-end"
                        : "flex-start",
                    borderRadius:
                      this.state.userName === message.user
                        ? "50px 0 50px 50px"
                        : "0 50px 50px 50px",
                  }}
                  loading={false}
                >
                  <Meta
                    avatar={
                      <Avatar className="meta">
                        {message.user[0].toUpperCase()}
                      </Avatar>
                    }
                    title={message.user + ":"}
                    description={message.msg}
                  />
                </Card>
              ))}
            </div>
            <div className="bottom">
              <Search
                placeholder="input message send"
                enterButton="Send"
                value={this.state.searchVal}
                size="large"
                onChange={(e) => this.setState({ searchVal: e.target.value })}
                onSearch={(value) => this.onButtonClicked(value)}
              />
            </div>
          </div>
        ) : (
          <div style={{ padding: "200px 40px" }}>
            <Search
              placeholder="Enter Username"
              enterButton="Login"
              size="large"
              onSearch={(value) => {
                this.setState({ isLoggedIn: true, userName: value });
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
//--------------------------------------------------------------------------------------------------------------------------

// import React, { useState, useEffect } from "react";
// import ReactDom from "react-dom";
// import webSocket, { Socket } from "socket.io-client";
// import "./App.css";
// const URL = "ws://127.0.0.1:8080";

// function App() {
//   const [ws, setWs] = useState(null);
//   const connectWebSocket = () => {
//     //開啟
//     setWs(webSocket("http://localhost:3000"));
//   };

//   useEffect(() => {
//     if (ws) {
//       //連線成功在 console 中打印訊息
//       console.log("webSocket client Connected...");
//       //設定監聽
//       ws.onmessage = (evt) => {
//         //收到訊息 加到 聊天室中
//         const message = JSON.parse(evt.data);
//         console.log("hey guy~~~");
//         this.addMessage(message);
//       };
//       initWebSocket();
//     }
//   }, [ws]);

//   const initWebSocket = () => {
//     //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
//     ws.on("getMessage", (message) => {
//       console.log(message);
//     });
//   };

//   const sendMessage = (mes) => {
//     console.log(mes);
//     //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
//     ws.emit("getMessage", "Hi");
//   };
//   return (
//     <>
//       <input type="button" value="連線" onClick={connectWebSocket} />
//       <input type="button" value="送出訊息" onClick={sendMessage} />
//       <div className="talkWindow">
//         <form className="talkForm">
//           <h1 style={{ color: "black" }}>WebSocket 聊天室</h1>
//           <div id="responseText" className="responseText"></div>

//           <br />
//           <input
//             style={{ width: "200px" }}
//             type="text"
//             name="message"
//             placeholder="Enter message..."
//           />
//           <input type="button" value="送出" onClick={sendMessage} />
//         </form>
//       </div>
//     </>
//   );
// }

// export default App;
