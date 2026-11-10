import React, { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import RefreshButton from "../components/refreshbutton.jsx";
import ChatModal from "../components/models/chatmodel.jsx";
import Loader from "../components/loader.jsx";
import { fetchJSON } from "../utils/api";

export default function MessagesPage({ messages = [], reload, user, onViewProfile }) {
  const [activeChat, setActiveChat] = useState(null);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchJSON("/users").then((data) => { if (active) setUsers(data); }).catch((error) => console.error("Failed to load users:", error)).finally(() => { if (active) setUsersLoading(false); });
    return () => { active = false; };
  }, []);

  const getUserName = useCallback((id) => users.find((person) => person.id === id)?.name || "Unknown User", [users]);
  const getPartnerId = (message) => message.sender_id === user.id ? message.receiver_id : message.sender_id;
  const term = searchTerm.trim().toLowerCase();
  const matchesSearch = (message) => getUserName(getPartnerId(message)).toLowerCase().includes(term);
  const pendingChats = messages.filter((message) => message.receiver_id === user.id && message.status === "pending" && matchesSearch(message));
  const activeChats = messages.filter((message) => message.status === "accepted" && (message.sender_id === user.id || message.receiver_id === user.id) && matchesSearch(message));

  const handleDecision = async (id, decision) => {
    try {
      await fetchJSON(`/messages/${id}`, { method: "PUT", body: JSON.stringify(decision) });
      await reload();
      if (decision === "accepted") setActiveChat(messages.find((message) => message.id === id) || null);
    } catch (error) { console.error("Failed to update status:", error); }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    try { await reload(); } finally { setRefreshing(false); }
  };

  return (
    <section className="chat-shell" aria-label="Messages and chats">
      <aside className="chat-sidebar" aria-label="Conversation list">
        <header className="chat-sidebar-header"><div><h1 className="chat-sidebar-title">Messages</h1><p className="mt-1 text-xs text-gray-500">Your project conversations</p></div><RefreshButton onClick={handleRefresh} refreshing={refreshing} /></header>
        <div className="relative"><Search size={16} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" /><label className="sr-only" htmlFor="chat-search">Search conversations</label><input id="chat-search" type="search" placeholder="Search people" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="chat-search pl-9" /></div>
        {usersLoading ? <Loader label="Loading conversations" size="sm" /> : <div className="min-h-0 flex-1 overflow-y-auto">
          {pendingChats.length > 0 && <><h2 className="chat-section-label">Requests <span className="ml-1">{pendingChats.length}</span></h2>{pendingChats.map((message) => <article key={message.id} className="chat-request"><p className="chat-request-name">{getUserName(message.sender_id)}</p><p className="mt-1 line-clamp-2 text-xs text-gray-500">{message.content}</p><div className="mt-2 flex gap-2"><button type="button" onClick={() => handleDecision(message.id, "accepted")} className="primary-button !min-h-8 !px-2.5 !py-1 !text-xs">Accept</button><button type="button" onClick={() => handleDecision(message.id, "rejected")} className="secondary-button !min-h-8 !px-2.5 !py-1 !text-xs">Decline</button></div></article>)}</>}
          <h2 className="chat-section-label">Conversations</h2>
          {activeChats.length ? activeChats.map((message) => {
            const partnerId = getPartnerId(message);
            const name = getUserName(partnerId);
            return <button type="button" key={message.id} onClick={() => setActiveChat(message)} aria-current={activeChat?.id === message.id ? "true" : undefined} className={`chat-list-item ${activeChat?.id === message.id ? "chat-list-item-active" : ""}`}><span className="chat-list-avatar">{name.slice(0, 1).toUpperCase()}</span><span className="min-w-0 flex-1"><span className="chat-list-name block">{name}</span><span className="chat-list-preview block">{message.content}</span></span></button>;
          }) : <p className="px-4 py-3 text-xs text-gray-500">{term ? "No conversations match." : "Accepted conversations will show here."}</p>}
        </div>}
      </aside>
      <main className="chat-main">
        {activeChat ? <ChatModal chat={activeChat} onClose={() => setActiveChat(null)} user={user} messages={messages} reload={reload} onViewProfile={onViewProfile} getUserName={getUserName} /> : <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center"><div className="grid h-12 w-12 place-items-center rounded-full border border-gray-700 bg-gray-800 text-gray-400"><Search size={20} /></div><p className="mt-4 font-semibold text-gray-200">Choose a conversation</p><p className="mt-1 max-w-xs text-sm text-gray-500">Your project messages will appear here.</p></div>}
      </main>
    </section>
  );
}
