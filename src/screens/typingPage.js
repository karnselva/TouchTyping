import { useEffect, useState, memo } from "react";
import DisplayText from "../components/displayText";

const skipKeys = [
  "CapsLock",
  "Shift",
  "Escape",
  "Control",
  "Alt",
  "Meta",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
  "ArrowDown"
]; //skip typing when above keys is pressed

let correctCharacter = {}; //store correctly typed charcater
let totalKeyStrokesTyped = 0,
  totalCorrectStrokes = 0; // total strokes in 5 mins
const url = "https://api.quotable.io/quotes/random"; // url for text to type

function TypingPage({
  isTyping,
  setTyping,
  currentTime,
  setRemainingTime,
  typingTotalTime
}) {
  const [typingText, setTypingText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCaps, setCaps] = useState(false);

  //adding typed char count when time ends before text typed completely
  if (currentTime === 0) {
    totalKeyStrokesTyped += currentIndex;
    totalCorrectStrokes += Object.keys(correctCharacter).length;
  }

  //fetching data started
  const fetchData = async () => {
    const response = await fetch(url);
    try {
      if (response.ok) {
        const data = await response.json();
        const content = data[0].content;
        setLoading(false);
        correctCharacter = {};
        setCurrentIndex(0);
        setTypingText(content.split(""));
      } else {
        console.error("4xx or 5xx error");
      }
    } catch (error) {
      console.error("network error", error);
    }
  };

  useEffect(() => {
    if (currentTime === typingTotalTime) {
      setLoading(true);
      fetchData();
    }
  }, [currentTime, typingTotalTime]);

  //key event side effect
  useEffect(() => {
    const keyHandler = (e) => {
      let keyPressed = e.key;

      if (skipKeys.includes(keyPressed)) {
        if (e.getModifierState("CapsLock")) {
          setCaps(false);
        } else {
          setCaps(true);
        }
        if (keyPressed === "CapsLock") {
          setCaps((prev) => !prev);
        } //indicate user that capslock is on

        return; //skip when enter skipped key
      }
      if (keyPressed === typingText[currentIndex]) {
        //to mark correctly typed text
        correctCharacter[currentIndex] = true;
      }
      if (currentIndex + 1 === typingText.length) {
        //calculate total stroke for accuracy and wpm
        totalKeyStrokesTyped += typingText.length;
        totalCorrectStrokes += Object.keys(correctCharacter).length;

        if (isTyping) {
          fetchData();
        } //fetch new text when previous text is completed and  time is not completed
      }
      if (currentIndex === 0) {
        setTyping(true);
      } //start typing

      setCurrentIndex((prev) => prev + 1);
    };
    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  }, [typingText, currentIndex, isTyping, setTyping]);

  const whileTyping = () => {
    if (loading) {
      return <p>loading....</p>;
    } else {
      return (
        <div>
          {isCaps && (
            <p style={{ textAlign: "center", fontWeight: "900" }}>
              CapsLock is ON
            </p>
          )}
          <div className="words__container">
            <div className="character__container">
              {typingText.map((character, index) => (
                <DisplayText
                  key={index}
                  id={index}
                  character={character}
                  currentIndex={currentIndex}
                  correctCharacter={correctCharacter}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  const typingResults = () => {
    return (
      <div className="typing__results_container">
        <span>
          Accuracy :{" "}
          {Math.round((totalCorrectStrokes / totalKeyStrokesTyped) * 100)}%
        </span>
        <span>
          Strokes-Per-Minutes :{" "}
          {Math.round(totalKeyStrokesTyped / (typingTotalTime / 60))}
        </span>
        <span>
          Words-Per-Minutes :{" "}
          {Math.round(totalKeyStrokesTyped / ((typingTotalTime * 5) / 60))}
        </span>

        <button
          onClick={() => {
            setTypingText([]);
            setRemainingTime(typingTotalTime);
          }}
        >
          Start Again
        </button>
      </div>
    );
  };

  return <div>{currentTime > 0 ? whileTyping() : typingResults()}</div>;
}

export default memo(TypingPage);
