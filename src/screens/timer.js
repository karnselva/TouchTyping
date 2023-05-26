import { useEffect } from "react";

function Timer({ isTyping, currentTime, setRemainingTime, setTyping }) {
  const getTime = () => {
    let seconds = (currentTime % 60).toString();
    let minutes = parseInt(currentTime / 60, 10).toString();
    seconds = seconds.length > 1 ? seconds : `0${seconds}`;
    return (
      <>
        <div>{minutes}</div>
        <div>{seconds}</div>
      </>
    );
  }; //converting time in seconds to minutes-seconds

  //set timer
  useEffect(() => {
    let timer;

    if (isTyping) {
      timer = setInterval(() => {
        currentTime--;
        setRemainingTime(currentTime); //updating time
      }, 1000);
    } // timer should ON when typing start

    if (currentTime === 0) {
      setTyping(false); //when time=0 typing is stopped
    }

    return () => clearInterval(timer); //clean up timer
  }, [isTyping, currentTime]);

  return (
    <>
      <h1>Timer</h1>
      <div className="timer">{getTime()}</div>
    </>
  );
}

export default Timer;
