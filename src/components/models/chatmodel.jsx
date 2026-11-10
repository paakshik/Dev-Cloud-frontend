import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUp, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { apiUrl } from "../../utils/api.js";

export default function ChatModal({ chat, onClose, user, messages = [], reload, onViewProfile, getUserName }) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const transcriptRef = useRef(null);
  const partnerId = chat.sender_id === user.id ? chat.receiver_id : chat.sender_id;
  const chatMessages = messages.filter((item) => (item.sender_id === chat.sender_id && item.receiver_id === chat.receiver_id) || (item.sender_id === chat.receiver_id && item.receiver_id === chat.sender_id));

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages.length]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!message.trim() || isSending) return;
    try {
      setIsSending(true);
      const response = await fetch(apiUrl("/api/v1/messages"), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: `msg_${Date.now()}`, sender_id: String(user.id), receiver_id: String(partnerId), content: message.trim(), timestamp: new Date().toISOString(), status: "chat" }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || "Message not sent");
      }
      setMessage("");
      await reload();
    } catch (error) { toast.error(error.message || "Could not send message."); }
    finally { setIsSending(false); }
  };

  const handleViewProfile = async () => {
    try {
      const response = await fetch(apiUrl(`/api/v1/users/${encodeURIComponent(partnerId)}`));
      if (!response.ok) throw new Error("Profile unavailable");
      onViewProfile(await response.json());
    } catch { toast.error("Could not load that profile."); }
  };

  return (
    <section className="flex h-full min-h-0 flex-col" aria-label={`Conversation with ${getUserName(partnerId)}`}>
      <header className="chat-main-header">
        <div className="flex min-w-0 items-center gap-3"><button type="button" onClick={onClose} className="icon-button md:hidden" aria-label="Back to conversations"><ArrowLeft size={18} /></button><span className="chat-list-avatar"><UserRound size={17} /></span><div className="min-w-0"><h2 className="truncate text-sm font-semibold text-gray-100">{getUserName(partnerId)}</h2><p className="text-xs text-gray-500">Project conversation</p></div></div>
        <button type="button" onClick={handleViewProfile} className="secondary-button !min-h-8 !px-3 !py-1 !text-xs">View profile</button>
      </header>
      <div ref={transcriptRef} id="chat-messages" className="chat-transcript" aria-live="polite">
        {chatMessages.length === 0 ? <div className="m-auto text-center"><p className="font-medium text-gray-300">Start the conversation</p><p className="mt-1 text-sm text-gray-500">Send a note to keep the project moving.</p></div> : chatMessages.map((item) => {
          const isMine = item.sender_id === user.id;
          return <div key={item.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}><article className={`chat-bubble ${isMine ? "chat-bubble-mine" : ""}`}><p className="break-words">{item.content || item.text}</p><time className="mt-1 block text-right text-[10px] text-gray-500" dateTime={item.timestamp}>{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></article></div>;
        })}
      </div>
      <form onSubmit={handleSend} className="chat-compose"><label className="sr-only" htmlFor="message-input">Write a message</label><input id="message-input" type="text" placeholder="Write a message…" value={message} onChange={(event) => setMessage(event.target.value)} className="field-control !rounded-full" disabled={isSending} /><button type="submit" disabled={isSending || !message.trim()} className="primary-button !h-10 !w-10 !min-h-0 !rounded-full !p-0" aria-label="Send message"><ArrowUp size={18} /></button></form>
    </section>
  );
}
