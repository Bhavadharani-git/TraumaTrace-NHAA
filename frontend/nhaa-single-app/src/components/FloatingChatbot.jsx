import { useState } from "react";
import "./FloatingChatbot.css";

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello. I am the NHAA 14566 AI Support Assistant. How may I assist you with real-time distress guidance, legal rights, or psychological support today?",
    },
  ]);

  const greetings = {
    en: "Language updated to English. How can I assist you?",
    hi: "भाषा को हिन्दी में अपडेट कर दिया गया है। मैं आपकी क्या सहायता कर सकता हूँ?",
    ta: "மொழி தமிழுக்கு மாற்றப்பட்டது. நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    te: "భాష తెలుగుకు మార్చబడింది. నేను మీకు ఎలా సహాయం చేయగలను?",
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const text = message.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { type: "user", text },
    ]);

    setMessage("");

    setTimeout(() => {
      const lower = text.toLowerCase();

      let response =
        "Thank you for reaching out. The NHAA 14566 system provides confidential psychological counseling, legal aid support, and administrative escalation for victims across India. For immediate assistance, you can call 14566 anytime.";

      if (
        lower.includes("emergency") ||
        lower.includes("danger") ||
        lower.includes("attack") ||
        lower.includes("threat")
      ) {
        response =
          "Immediate Assistance Alert: If you are facing imminent physical danger, please dial 14566 immediately.";
      } else if (
        lower.includes("right") ||
        lower.includes("law") ||
        lower.includes("act") ||
        lower.includes("poa")
      ) {
        response =
          "NHAA can provide guidance regarding statutory rights under the SC/ST (Prevention of Atrocities) Act and connect you with appropriate support.";
      } else if (
        lower.includes("track") ||
        lower.includes("status") ||
        lower.includes("complaint")
      ) {
        response =
          "To track your complaint, please use the Citizen Support portal and your complaint or ticket details.";
      } else if (
        lower.includes("counsel") ||
        lower.includes("trauma") ||
        lower.includes("psycholog") ||
        lower.includes("tele-manas")
      ) {
        response =
          "NHAA provides psychological support and can connect you with appropriate counseling assistance. For immediate help, call 14566.";
      }

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: response },
      ]);
    }, 400);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);

    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        text: greetings[lang],
      },
    ]);
  };

  const simulateVoice = () => {
    setMessage(
      "I need assistance regarding statutory relief and counseling"
    );
  };

  return (
    <aside className="nhaa-ai-bot-wrapper">
      {open && (
        <div className="nhaa-chat-panel">
          {/* HEADER */}
          <div className="nhaa-chat-header">
            <div className="nhaa-chat-header-left">
              <div className="nhaa-bot-icon">
                <span className="material-symbols-outlined">
                  smart_toy
                </span>

                <span className="nhaa-online-dot" />
              </div>

              <div>
                <div className="nhaa-chat-title">
                  NHAA AI Support
                </div>

                <div className="nhaa-chat-subtitle">
                  Confidential 24x7 Assistant
                </div>
              </div>
            </div>

            <button
              type="button"
              className="nhaa-chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close Chat"
            >
              <span className="material-symbols-outlined">
                close
              </span>
            </button>
          </div>

          {/* LANGUAGE */}
          <div className="nhaa-chat-language">
            <span>Language:</span>

            <div>
              <button
                type="button"
                className={language === "en" ? "active" : ""}
                onClick={() => changeLanguage("en")}
              >
                English
              </button>

              <span>|</span>

              <button
                type="button"
                className={language === "hi" ? "active" : ""}
                onClick={() => changeLanguage("hi")}
              >
                हिन्दी
              </button>

              <span>|</span>

              <button
                type="button"
                className={language === "ta" ? "active" : ""}
                onClick={() => changeLanguage("ta")}
              >
                தமிழ்
              </button>

              <span>|</span>

              <button
                type="button"
                className={language === "te" ? "active" : ""}
                onClick={() => changeLanguage("te")}
              >
                తెలుగు
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="nhaa-chat-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={
                  item.type === "user"
                    ? "nhaa-user-message-row"
                    : "nhaa-bot-message-row"
                }
              >
                {item.type === "bot" && (
                  <div className="nhaa-message-bot-icon">
                    <span className="material-symbols-outlined">
                      support_agent
                    </span>
                  </div>
                )}

                <div
                  className={
                    item.type === "user"
                      ? "nhaa-user-message"
                      : "nhaa-bot-message"
                  }
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <form
            className="nhaa-chat-input"
            onSubmit={sendMessage}
          >
            <button
              id="chat-mic-btn"
              type="button"
              title="Voice Input"
              onClick={simulateVoice}
            >
              <span className="material-symbols-outlined">
                mic
              </span>
            </button>

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message confidentially..."
              type="text"
            />

            <button
              type="submit"
              aria-label="Send message"
              className="nhaa-send-button"
            >
              <span className="material-symbols-outlined">
                send
              </span>
            </button>
          </form>
        </div>
      )}

      {/* FLOATING LAUNCHER */}
      <button
        type="button"
        className="nhaa-chat-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open AI Support Chat"
      >
        <span className="nhaa-launcher-icon">
          <span className="material-symbols-outlined">
            smart_toy
          </span>

          <span className="nhaa-launcher-online-ping" />
          <span className="nhaa-launcher-online-dot" />
        </span>

        <span className="nhaa-launcher-text">
          <span>NHAA AI Support</span>
          <small>Online &amp; 24x7</small>
        </span>
      </button>
    </aside>
  );
}