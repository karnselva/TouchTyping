import { memo } from "react";
import Tippy from "@tippyjs/react"; //add tooltip
import "tippy.js/dist/tippy.css";

function DisplayText({ character, currentIndex, id, correctCharacter }) {
  let classes = "";
  if (currentIndex === id) {
    classes += "current__character";
  }
  if (id < currentIndex) {
    if (correctCharacter[id]) {
      classes += "correctly__typed";
    } else {
      classes += "wrongly__typed";
    }
  } //add styles current , wrong,correct typed character

  return (
    <>
      <Tippy
        content="Start Typing..."
        visible={currentIndex === 0 && id === 0 ? true : false}
      >
        <div className={classes}>{character}</div>
      </Tippy>
    </>
  );
}

export default memo(DisplayText); //to prevent rerender when timer is update
