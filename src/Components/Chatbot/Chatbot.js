// SET A BUTTON TO DISEASE LIST WHEN CLICKED IT NEED TO PROCESS
import React, { useEffect, useRef, useState } from "react";
import "./Chatbot.css";
import { findResponse } from "./data/botMessagesHandle";
import { readDiseaseDataFromCsv, recommendDiseases } from "./data/botFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartPulse, faPaperPlane, faRefresh } from "@fortawesome/free-solid-svg-icons";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: "bot", text: "Hello.. I'm listening! Go on..", },
    // can also send multiple messages at a time // {obj-1},{obj-2}
    /*messages object has: 
    id='bot/user', 
    text='' , 
    typing='Typing...', 
    delay='1000-animation delay',
    animate=true/false,
    defaultClass='', 
    type='button/input',
    typeMsg=[] buttons messages or payload messages */
  ]);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [diseases, setDiseases] = useState([]);
  const inputRef = useRef(null);
  const messageContainerRef = useRef(null);
  const isAnyMessageAnimating = messages.some(message => message.animate);
  const diseaseKey = ["diagnose", "disease", "symptoms"];

  function output(input) {
    const lowerInput = input.toLowerCase();
    const includesDiagnose = diseaseKey.some(keyword => lowerInput.includes(keyword));
    if (includesDiagnose) {
      if (lowerInput) {
        setWaitingForInput(true);
        botMessageSend({ text: "Enter Disease 📝", type: 'button', typeMsg: ['Cancel'] });
      }
    } else {
      botMessageSend({ text: findResponse(lowerInput) });
    }
  }

  function userMessageSend(...messages) {
    // can add defaultClass if needed when calling
    const updatedMessages = messages.map((message) => {
      const newMessage = { id: "user", ...message };
      return newMessage;
    });
    setMessages((prevMessages) => [...prevMessages, ...updatedMessages]);
  }

  async function botMessageSend(...messages) {
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const { text, typing = 'Typing...', delay = 1000, defaultClass, type, typeMsg = ['Ok'] } = message;
      const newMessage = { id: 'bot', text, typing, delay, animate: true, defaultClass };

      await new Promise((resolve) => {
        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, newMessage]);

          if (type === 'button') {
            newMessage.text = `${text}<br/>
            ${typeMsg.map((value, index) => `<button id="bot-btn-${Date.now()}-${index}" class='quickmessage bot-btn'>${value}</button>`).join('')}`;
            setMessages((prevMessages) => [...prevMessages.slice(0, -1), newMessage]);
          }

          setTimeout(() => {
            setMessages((prevMessages) => {
              const index = prevMessages.findIndex((msg) => msg === newMessage);
              if (index !== -1) {
                const updatedMessages = [...prevMessages];
                updatedMessages[index] = { ...newMessage };
                return updatedMessages;
              }
              return prevMessages;
            });
            resolve();
            newMessage.animate = false;
          }, delay);
        }, 100);// delay before the next message
      });
    }
  }

  async function handleInputSend(btnMessage) {
    const messageToSend = typeof btnMessage === 'string' ? btnMessage : inputRef.current.value;
    if (messageToSend === '') { return }
    setDiseases([]);
    inputRef.current.value = "";
    userMessageSend({ text: messageToSend });
    if (waitingForInput) {
      if (diseaseKey.some(keyword => messageToSend.toLowerCase().includes(keyword))) {
        setWaitingForInput(true);
        botMessageSend({ text: "Enter Disease 📝", type: 'button', typeMsg: ['Cancel'] });
        return;
      }
      setWaitingForInput(false);
      readDiseaseDataFromCsv(messageToSend)
        .then(message => { botMessageSend(message) });
    } else {
      if (messageToSend) {
        output(messageToSend);
      }
    }
  }

  function reset() {
    setMessages([{ id: "bot", text: "Hello.. I'm listening! Go on.." }]);
  }

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
    waitingForInput && inputRef.current.focus();
  }, [messages, waitingForInput]);

  useEffect(() => {
    function handleButtonClick(event) {
      const clickedButtonId = event.target.id;
      const clickedButton = document.getElementById(clickedButtonId);
      if (clickedButtonId.startsWith('bot-btn')) {
        userMessageSend({ text: clickedButton.innerText });
        output(clickedButton.innerText);
      }
    }

    var messageSection = document.getElementById('message-section');
    messageSection.addEventListener('click', handleButtonClick);

    return () => {
      messageSection.removeEventListener('click', handleButtonClick);
    };
  }, []);

  return (
    <div className="chatbot">
      <div id="botheader">
        <h1>HealthBot+</h1>
        <button className="send" onClick={reset}>
          <div className="circle refresh">
            <FontAwesomeIcon className="icon-block" icon={faRefresh} />
          </div>
        </button>
      </div>
      <hr />

      <div className={diseases.length > 10 && 'disease-box'}>
        {diseases.map((disease, index) => (
          <button onClick={() => handleInputSend(disease)} className="disease-btn" key={index}>{disease}</button>
        ))}
      </div>

      <div
        id="message-section"
        ref={messageContainerRef}
        className="message-container"
      >
        {messages.map((message, index) => (
          <span
            className={`message ${message.id === 'bot' && message.animate ? 'typing-animation' : ''}'`}
            key={index}
            id={message.id}
          >
            {message.animate ? (
              <span>{message.typing}</span>
            ) : (
              <span className={`${message.defaultClass && message.defaultClass}`}>
                <span dangerouslySetInnerHTML={{ __html: message.text }} />
              </span>
            )}
          </span>
        ))}
      </div>
      <div id="input-section">
        <div className="allquickbtn">
          <button
            tabIndex="1"
            className="quickmessage"
            onClick={() => handleInputSend("Diagnose 🤒")}
            disabled={isAnyMessageAnimating}
          >
            Diagnose 🤒
          </button>
          <button
            tabIndex="2"
            className="quickmessage"
            onClick={() => handleInputSend("Contact 📞")}
            disabled={isAnyMessageAnimating}
          >
            Contact 📞
          </button>
        </div>
        <div className="input-flex">
          <input
            ref={inputRef}
            style={{ padding: "0.6rem", paddingLeft: "1rem" }}
            type="text"
            placeholder="Type a message..."
            tabIndex="3"
            onChange={(e) => {
              const inputValue = e.target.value.trim().toLowerCase();
              if (waitingForInput) {
                if (inputValue.length === 0) {
                  setDiseases([]);
                } else {
                  recommendDiseases(inputValue).then((recommendedDiseases) => {
                    setDiseases([...new Set(recommendedDiseases.disease)].sort());
                  });
                }
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && handleInputSend()}
            disabled={isAnyMessageAnimating}
          />
          <button
            type="submit"
            className="send"
            onClick={handleInputSend}
            tabIndex="3"
            disabled={isAnyMessageAnimating}
          >
            <div className="circle">
              <FontAwesomeIcon className="icon-block" icon={waitingForInput ? faHeartPulse : faPaperPlane} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
