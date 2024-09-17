import React, { useState, useRef, useEffect } from 'react';
import '../index.css';
import Message from "./Message";

const Chat = () => {
    const [messages, setMessages] = useState([]); // {role: "user", content: "data"}
    const [input, setInput] = useState('');
    const [inProcessOfSending, setInProcessOfSending] = useState(false);
    const endOfMessagesRef = useRef(null);

    const sendMessageToServer = async () => {
        try {
            const response = await fetch('http://localhost:8080/message/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "messages": messages.slice(0, -1) }),
            });

            const data = await response.json();
            setMessages(prevMessages => {
                if (prevMessages.length === 0) {
                    return prevMessages;
                }

                // Update the last message with new content
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = { ...updatedMessages[updatedMessages.length - 1], content: data };

                return updatedMessages;
            });
            setInProcessOfSending(false);
        } catch (error) {
            console.error('Error sending message to server: ', error);
        }
    };

    // Sends user message if one is not being processed
    const handleSend = () => {
        if (inProcessOfSending) {
            return;
        }
        if (input.trim()) {
            setInProcessOfSending(true);
            const newUserMsg = {role: "user", content: input}
            const aiPlaceholderMsg = {role: "assistant", content: "..."}
            setMessages(prevMessages => [...prevMessages, newUserMsg, aiPlaceholderMsg]);
            setInput('');
        }
    };

    const clearChat = () => {
        if (inProcessOfSending) {
            return;
        }

        setMessages([]);
    }

    // When aiPlaceholderMsg is added, send message to server.
    useEffect(() => {
        if (inProcessOfSending && messages.length > 0 && messages[messages.length - 1].role === "assistant" && messages[messages.length - 1].content === "...") {
            sendMessageToServer();
        }
    }, [messages]);

    // Scroll to the bottom of the message container when messages change
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index}>
                       <Message role={message.role} content={message.content} />
                    </div>
                ))}
                <div ref={endOfMessagesRef}/>
            </div>
            <div className="input-container">
                <button onClick={clearChat} disabled={inProcessOfSending} className={inProcessOfSending ? "button-invalid" : "clear-chat-button"} >
                    Clear Chat
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                    placeholder="Type a message"
                    disabled={inProcessOfSending}
                />
                <button onClick={handleSend} disabled={inProcessOfSending}
                        className={inProcessOfSending ? "button-invalid" : ""}>
                    {inProcessOfSending ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default Chat;