import React, { useState, useContext, useEffect } from 'react';
import './Sidebar.css';
import { assets } from "../../assets/assets.js";
import { Context } from '../../context/context.jsx';

const Sidebar = () => {
    const { clearChat } = useContext(Context);
    const [extended, setExtended] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('English');
    const [notifications, setNotifications] = useState(true);

    const [help, setHelp] = useState([]);

    // Load dark mode preference from localStorage if available
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        }
    }, []);

    // Apply dark mode on body class change (for global theme)
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const [recentChats, setRecentChats] = useState([
        { id: 1, title: 'What is React?', icon: assets.message_icon },
        { id: 2, title: 'How to use Hooks?', icon: assets.message_icon },
        { id: 3, title: 'State management in React', icon: assets.message_icon },
    ]);

    const handleNewChatClick = () => {
        setRecentChats([]);
        clearChat();
        const newChat = {
            id: 1,
            title: 'New Chat',
            icon: assets.message_icon
        };
        setRecentChats([newChat]);
        setExtended(false);
    };

    const handleSettingsClick = () => {
        setShowSettings((prev) => !prev);
        setShowHelp(false);
    };

    const handleHelpClick = () => {
        setShowHelp((prev) => !prev);
        setShowSettings(false);
        setHelp([
            { id: 1, title: 'Start New Chat', description: 'Click "New Chat" to begin a conversation.' },
            { id: 2, title: 'Change Theme', description: 'Go to Settings > Theme to switch light/dark mode.' },
            { id: 3, title: 'Language Option', description: 'Go to Settings > Language to switch language.' },
        ]);
    };

    const handleContactClick = () => {
        window.location.href = 'mailto:support@example.com?subject=Help Needed&body=Describe your issue here';
    };

    return (
        <div className={`sidebar ${darkMode ? 'dark-theme' : ''}`}>
            <div className="top">
                <img onClick={() => setExtended((prev) => !prev)} className='menu' src={assets.menu_icon} alt="Menu Icon" />
                <div className="new-chat" onClick={handleNewChatClick}>
                    <img src={assets.plus_icon} alt="Plus Icon" />
                    {extended ? <p>New Chat</p> : null}
                </div>

                {extended && (
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        {recentChats.length > 0 ? (
                            recentChats.map((chat) => (
                                <div key={chat.id} className="recent-entry">
                                    <img src={chat.icon} alt="Message Icon" />
                                    <p>{chat.title}</p>
                                </div>
                            ))
                        ) : (
                            <p>No Recent Chats</p>
                        )}
                    </div>
                )}
            </div>

            <div className="bottom">
                <div className="bottom-item recent-entry" onClick={handleHelpClick}>
                    <img src={assets.question_icon} alt="Help Icon" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="bottom-item recent-entry" onClick={handleSettingsClick}>
                    <img src={assets.setting_icon} alt="Settings Icon" />
                    {extended ? <p>Settings</p> : null}
                </div>
            </div>

            {showSettings && (
                <div className="settings-menu">
                    <h4>Options</h4>
                    <ul>
                        <li onClick={() => setDarkMode(!darkMode)}>
                            🌙 Theme: {darkMode ? 'Dark' : 'Light'} Mode
                        </li>
                        <li onClick={() => setLanguage(language === 'English' ? 'Hindi' : 'English')}>
                            🌐 Language: {language}
                        </li>
                        <li onClick={() => setNotifications(!notifications)}>
                            🔔 Notifications: {notifications ? 'On' : 'Off'}
                        </li>
                    </ul>
                </div>
            )}

            {showHelp && (
                <div className="help-section">
                    <h4>Help Center</h4>
                    <div className="help-list">
                        {help.map((item) => (
                            <div key={item.id} className="help-item">
                                <strong>{item.title}</strong>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleContactClick} className="contact-btn">
                        📧 Contact Us
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;


