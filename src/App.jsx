import { useState, useEffect } from "react";
import "./App.css";
import ChatMessage from "./ChatMessage";

function App() {
  // use effect run once when app loads
  useEffect(() => {
    getEngines();
  }, []);

  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState('ada');
  const [chatLog, setChatLog] = useState([
    { user: "gpt", message: "How can I help you?" },
    { user: "me", message: "i want to use chatgpt" },
  ]);

  function clearChat() {
    setChatLog([]);
  }

  function getEngines() {
    fetch("http://localhost:3080/models")
      .then((res) => res.json())
      .then((data) => {
        data.models.data;
        console.log(data.models);
        setModels(data.models)
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];

    setInput("");
    setChatLog(chatLogNew);

    // fetch response to the api combining the chatlog array of messages an sending
    //it as a message to localhost:3080 as a post

    const messages = chatLogNew.map((message) => message.message).join("");

    const response = await fetch("http://localhost:3080", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
        currentModel,
      }),
    });

    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
    console.log(data.message);
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="sidemenu-btn" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className="models">
          <select onChange={(e)=>{setCurrentModel(e.target.value)}}>
{models.map((model, index) =>(
  <option value={model.id}key={index}>
    {model.id}
  </option>
))}
          </select>
        </div>
      </aside>

      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage message={message} key={index} />
          ))}
        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              className="chat-input-textarea"
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here"
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
