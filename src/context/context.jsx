import { createContext, useState, useCallback, useEffect } from "react";
import { main } from "../config/gemini"; 

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [response, setResponse] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Input, setInput] = useState(""); 
  const [resultData, setResultData] = useState(""); 

  const onSent = useCallback(async (prompt) => {
    console.log("Prompt in onSent:", prompt);  // Debugging: Log the prompt
    setIsLoading(true);  // Set loading to true when a request is made
    setError(null);
    try {
      const result = await main(prompt);  // Only pass a string here
      setResponse(result);
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Error in AI response:", err);
    } finally {
      setIsLoading(false);  // Set loading to false once response is received or error occurs
    }
  }, []);  
  
  // useEffect(() => {
  //   onSent("tell me about fast and furious?");
  // }, [onSent]);

  // Handle input change and set placeholder empty when user types
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const clearChat = () => {
    setInput("");
    setResponse("");
  };
  
  const contextValue = {
    response,
    isLoading,
    error,
    onSent,
    Input,
    setInput,
    handleInputChange,
    clearChat
  };
  

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
