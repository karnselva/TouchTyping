import { useState } from "react";
import Timer from "./screens/timer";
import TypingPage from "./screens/typingPage";
import "./styles.css";

let typingTotalTime = 300; //5minutes

export default function App() {
  const [remainingTime, setRemainingTime] = useState(typingTotalTime);
  const [isTyping, setTyping] = useState(false);

  return (
    <div className="App">
      <Timer
        currentTime={remainingTime}
        setRemainingTime={setRemainingTime}
        isTyping={isTyping}
        setTyping={setTyping}
      />
      <TypingPage
        setTyping={setTyping}
        isTyping={isTyping}
        currentTime={remainingTime}
        setRemainingTime={setRemainingTime}
        typingTotalTime={typingTotalTime}
      />
    </div>
  );
}
