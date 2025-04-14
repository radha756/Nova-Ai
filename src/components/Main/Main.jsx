import React, { useContext, useState, useEffect, useRef } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from "../../context/context.jsx";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-IN';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const Main = () => {
  const { onSent, response, isLoading, error, Input, setInput } = useContext(Context);
  const [lastPrompt, setLastPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [character, setCharacter] = useState(assets.char1); // Default character
  const [showCharacterOptions, setShowCharacterOptions] = useState(false);

  const chatHistoryRef = useRef(null);

  const handleSend = () => {
    if (Input.trim() === "") return;

    const formatInstruction = `
      Please provide the answer in a well-structured format with:
      - Bold section headings (like **Key Components of...)
      - Bullet points with bold titles (like * **Meaning:** *)
      - Use markdown formatting for bold and bullet styles
    `;

    const finalPrompt = `${Input}\n\n${formatInstruction}`;
    setLastPrompt(Input);

    setChatHistory((prev) => [...prev, { sender: "user", message: Input }]);

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setChatHistory((prev) => [...prev, { sender: "user", message: "📷 Image uploaded", image: imageUrl }]);
    }
  };

  const handleCardClick = (question) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    if (response && lastPrompt) {
      setChatHistory((prev) => [...prev, { sender: "ai", message: response }]);
      setLastPrompt('');
    }
  }, [response]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className='main'>
      <div className="nav">
        <p>Nova AI</p>
        <div className="character-selector">
          {/* Removed user icon and added character selection */}
          <img
            src={character}
            alt="Character Icon"
            onClick={() => setShowCharacterOptions(!showCharacterOptions)}
            className="user-icon"
          />
          {showCharacterOptions && (
            <div className="character-dropdown">
              <p>Choose Character</p>
              <img src={assets.char1} alt="Char 1" onClick={() => setCharacter(assets.char1)} />
              <img src={assets.char2} alt="Char 2" onClick={() => setCharacter(assets.char2)} />
              <img src={assets.char3} alt="Char 3" onClick={() => setCharacter(assets.char3)} />
              <img src={assets.char4} alt="Char 4" onClick={() => setCharacter(assets.char4)} />
            </div>
          )}
        </div>
      </div>

      <div className="main-container">
        {chatHistory.length > 0 && (
          <div className="chat-history" ref={chatHistoryRef}>
            {chatHistory.map((chat, index) => (
              <div key={index} className={`chat-message ${chat.sender}`}>
                {chat.sender === "user" ? (
                  <div>
                    <p><strong>You:</strong> {chat.message}</p>
                    {chat.image && (
                      <img src={chat.image} alt="Uploaded" className="uploaded-img" />
                    )}
                  </div>
                ) : (
                  <div className="ai-response">
                    <img src={assets.gemini_icon} alt="AI" className="ai-photo" />
                    <div className="ai-response-text"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(marked.parse(chat.message))
                      }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!response && !isLoading && !Input && chatHistory.length === 0 && (
          <>
            <div className="greet">
              <p><span>Greetings, Dev!</span></p>
              <p>How can I assist you today?</p>
            </div>

            <div className="cards">
              <div className="card" onClick={() => handleCardClick("What’s my next step to achieve my goal?")}>
                <p>What’s my next step to achieve my goal?</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card" onClick={() => handleCardClick("What is the best way to handle errors in this code?")}>
                <p>What is the best way to handle errors in this code?</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card" onClick={() => handleCardClick("What’s one thing I can do better tomorrow?")}>
                <p>What’s one thing I can do better tomorrow?</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card" onClick={() => handleCardClick("Improve the readability of the following code")}>
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        )}

        {isLoading && <p className="loading">Loading...</p>}
        {error && <p className="error">Error: {error}</p>}

        <div className="main-bottom">
          <div className={`search-box ${isListening ? "listening" : ""}`}>
            <input
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              value={Input}
              type="text"
              placeholder='Ask anything...'
            />
            <div>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="imageInput"
                onChange={handleImageUpload}
              />
              <label htmlFor="imageInput">
                <img src={assets.gallery_icon} alt="Gallery" />
              </label>
              <img onClick={handleMicClick} src={assets.mic_icon} alt="Mic" />
              <img onClick={handleSend} src={assets.send_icon} alt="Send" />
            </div>
          </div>
          <p className='bottom-info'>
            Nova AI may display incorrect information, including about people, so double-check its response.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
