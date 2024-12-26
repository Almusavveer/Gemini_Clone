import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false)
    setShowResult(false)
 }
  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let res;
    if (prompt !== undefined) {
      res = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      res = await run(input);
    }
    let resArr = res.split("**");
    let newRes = "";
    for (let i = 0; i < resArr.length; i++) {
      if (i == 0 || i % 2 != 1) {
        newRes += resArr[i];
      } else {
        newRes += "<b>" + resArr[i] + "</b>";
      }
    }

    let res2 = newRes.split("*").join("</br>");
    let newResArr = res2.split(" ");
    for (let i = 0; i < newResArr.length; i++) {
      const nextWord = newResArr[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
