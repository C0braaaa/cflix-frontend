import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';

import styles from './ChatBot.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { chatWithAI_API } from '../../services/chatbotService';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function ChatBot({ showChatbox }) {
    const chatRef = useRef(null);

    const messagesEndRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState(() => {
        const saveChat = sessionStorage.getItem('cflix_chat_history');

        if (saveChat) {
            return JSON.parse(saveChat);
        }

        return [
            {
                role: 'C-Bot',
                content: 'Xin chào! Tôi là Jarvis, trợ lý ảo của Cflix. Tôi có thể giúp gì cho bạn hôm nay?',
            },
        ];
    });

    useEffect(() => {
        sessionStorage.setItem('cflix_chat_history', JSON.stringify(messages));
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (chatRef.current && !chatRef.current.contains(e.target)) {
                showChatbox(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showChatbox]);

    const handleSendMessage = async () => {
        const messageToSend = inputValue.trim();
        if (!messageToSend || loading) return;

        const userMessage = { role: 'user', content: messageToSend };
        const historyForAI = [...messages, userMessage];
        setMessages(historyForAI);
        setInputValue('');

        setLoading(true);

        try {
            const res = await chatWithAI_API(historyForAI);

            if (res && res.content) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'C-Bot',
                        content: res.content,
                    },
                ]);
            }
        } catch (error) {
            console.error('Bot no di choi voi ban gai roi: ', error);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = (text) => {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }

            parts.push(
                <Link
                    key={match.index}
                    to={match[2]}
                    style={{ color: 'var(--primary-color)' }}
                    onClick={() => showChatbox(false)}
                >
                    {match[1]}{' '}
                </Link>,
            );
            lastIndex = linkRegex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }
        return parts.length > 0 ? parts : text;
    };
    return (
        <div ref={chatRef} className={cx('wrapper')}>
            {/* Header */}
            <header className={cx('header')}>
                <div className={cx('header__left')}>
                    <div className={cx('header__logo')}>
                        <img src="/assets/images/chatbot_logo.png" alt="logo-chatbot" />
                    </div>
                    <div className={cx('header__title')}>
                        <h4 className={cx('title')}>Jarvis</h4>
                        <span className={cx('subtitle')}>CFLIX Chat Bot</span>
                    </div>
                </div>
                <div className={cx('header__right')} onClick={() => showChatbox(false)}>
                    <span className={cx('close')}>&times;</span>
                </div>
            </header>
            {/* Main */}
            <main className={cx('main')}>
                <div className={cx('chat-messages')}>
                    {messages.map((msg, index) => (
                        <div className={cx('message-row', msg.role)} key={index}>
                            <div className={cx('message-content')}>
                                <span className={cx('message-sender')}>{msg.role === 'C-Bot' ? 'Jarvis' : 'Bạn'}</span>
                                <div className={cx('bubble')}>{renderMessage(msg.content)}</div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className={cx('message-row', 'C-Bot')}>
                            <div className={cx('message-content')}>
                                <span className={cx('message-sender')}>Jarvis</span>
                                <div className={cx('bubble', 'typing-indicator')}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            {/* Footer */}
            <footer className={cx('footer')}>
                <div className={cx('footer__input')}>
                    <input
                        type="text"
                        className={cx('input')}
                        placeholder="Hỏi tôi cái gì đó..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && inputValue.trim() && !loading) {
                                handleSendMessage();
                            }
                        }}
                    />
                    <span className={cx('footer__send', { disabled: loading })} onClick={handleSendMessage}>
                        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPaperPlane} />}
                    </span>
                </div>
            </footer>
        </div>
    );
}

export default ChatBot;
