import React, { useContext, useState, useEffect, useRef } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from "../../context/context.jsx";
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { FaMoon, FaSun } from "react-icons/fa";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-IN';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const Main = () => {
  const { onSent, response, isLoading, error, Input, setInput } = useContext(Context);
  const [chatHistory, setChatHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [theme, setTheme] = useState("light");
  const [greetMain, setGreetMain] = useState("");
  const [greetSub, setGreetSub] = useState("");
  const chatHistoryRef = useRef(null);

  // Dynamic greetings
  const mainGreetings = [
    "Greetings, Dev! Ready to code?",
    "Hello there! How can I help you today?",
    "Hey! Ask me anything.",
    "Hi! I'm Nova AI, your assistant.",
    "Welcome back! What do you want to explore today?"
  ];

  const subGreetings = [
    "Let's create something amazing.",
    "Your AI buddy is here to help.",
    "Ask questions or get coding tips!",
    "Knowledge is power. Let's start!",
    "Need assistance? I'm all ears."
  ];

  useEffect(() => {
    const mainIndex = Math.floor(Math.random() * mainGreetings.length);
    const subIndex = Math.floor(Math.random() * subGreetings.length);
    setGreetMain(mainGreetings[mainIndex]);
    setGreetSub(subGreetings[subIndex]);
  }, []);

  const handleSend = () => {
    if (Input.trim() === "") return;

    const formatInstruction = `
You are Nova AI, a highly intelligent and friendly assistant.
Answer the user's question clearly, concisely, and professionally.
- Keep answers short and relevant.
- Provide examples or code if necessary.
- Avoid unnecessary details.
- Always be polite and precise.
`;

    const finalPrompt = chatHistory.map(chat => {
      return chat.sender === "user" ? `User: ${chat.message}` : `AI: ${chat.message}`;
    }).join("\n") + `\nUser: ${Input}\nAI:${formatInstruction}`;

    setChatHistory(prev => [...prev, { sender: "user", message: Input }]);
    onSent(finalPrompt);
    setInput('');
  };

  const handleMicClick = () => {
    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => {
        handleSend();
        setIsListening(false);
      }, 500);
    };

    recognition.onerror = (event) => {
      alert("Mic Error: " + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (response) {
      setChatHistory(prev => [...prev, { sender: "ai", message: response }]);
    }
  }, [response]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`main ${theme}`}>
      <div className="nav">
        <p>Nova AI</p>
        <button className="theme-toggle" onClick={handleThemeToggle}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </div>
      
      <div className="main-container">
        {chatHistory.length > 0 && (
          <div className="chat-history" ref={chatHistoryRef}>
            {chatHistory.map((chat, index) => (
              <div key={index} className={`chat-message ${chat.sender}`}>
                {chat.sender === "user" ? (
                  <p>{chat.message}</p>
                ) : (
                  <div
                    className="ai-response-text"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(marked.parse(chat.message))
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        )}

        {chatHistory.length === 0 && !isLoading && (
          <div className="greet">
            <p>{greetMain}</p>
            <p>{greetSub}</p>
          </div>
        )}

        {isLoading && <p className="loading">Loading...</p>}
        {error && <p className="error">Error: {error}</p>}

        <div className="main-bottom">
          <div className={`search-box ${isListening ? "listening" : ""}`}>
            <textarea
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={handleKeyDown}
              value={Input}
              placeholder='Ask anything...'
              rows="1"
            />
            <div>
              <img onClick={handleMicClick} src={assets.mic_icon} alt="Mic" />
            </div>
          </div>
          <p className='bottom-info'>
            Nova AI may display incorrect information, so double-check its response.
          </p>
        </div>
        <div className="credits">
          Built with ❤️ by Radha
        </div>
      </div>
    </div>
  );
};

export default Main;
