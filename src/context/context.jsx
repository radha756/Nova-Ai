import { createContext, useState, useCallback } from "react";
import { main } from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [response, setResponse] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Input, setInput] = useState("");
  const [resultData, setResultData] = useState("");

  const onSent = useCallback(async (prompt) => {
    console.log("Prompt in onSent:", prompt);
    setIsLoading(true);
    setError(null);
    setRecentPrompt(prompt);

    try {
      const result = await main(prompt);
      setResponse(result);
      setResultData(result);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e) => setInput(e.target.value);

  const clearChat = () => {
    setInput("");
    setResponse("");
    setResultData("");
  };

  const contextValue = {
    response,
    isLoading,
    error,
    onSent,
    Input,
    setInput,
    handleInputChange,
    clearChat,
    recentPrompt,
    resultData
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
