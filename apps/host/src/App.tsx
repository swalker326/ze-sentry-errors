import { useState } from "react";
import reactLogo from "./assets/react.svg";
import RemoteApp from "remote/App";
import "./App.css";

function App() {
  throw new Error("This is an error");
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Host Application</h1>
      <div className="card" style={{ border: "1px solid red" }}>
        <h1>Remote Application</h1>
        <RemoteApp />
      </div>
    </div>
  );
}

export default App;
