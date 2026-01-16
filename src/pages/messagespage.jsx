// importing all files and dependencies
import React, { useState, useEffect, useCallback } from "react";
import RefreshButton from "../components/refreshbutton.jsx";
import ChatModal from "../components/models/chatmodel.jsx";
import { fetchJSON } from "../utils/api";

export default function MessagesPage({ messages, reload, user, onViewProfile }) {
  const [activeChat, setActiveChat] = useState(null);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all users once
  useEffect(() => {
    (async () => {
      try {
        setUsers(await fetchJSON("/users"));
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    })();
  }, []);

  // Quick lookup for user names
  const getUserName = useCallback(
    (id) => users.find((u) => u.id === id)?.name || "Unknown User",
    [users]
  );

  // Categorize messages
  const pendingChats = messages.filter(
    (m) => m.receiver_id === user.id && m.status === "pending"
  );
  const activeChats = messages.filter(
    (m) =>
      m.status === "accepted" &&
      (m.sender_id === user.id || m.receiver_id === user.id)
  );

  // Accept or reject collaboration requests
  const handleDecision = async (id, decision) => {
    try {
      await fetchJSON(`/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(decision),
      });

      await reload();
      if (decision === "accepted") {
        const accepted = messages.find((m) => m.id === id);
        if (accepted) setActiveChat(accepted);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await reload();
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <section className="flex h-[80vh] rounded-xl overflow-hidden border border-gray-700 bg-[#ECE5DD]">
      {/* LEFT: Sidebar */}
      <aside className="w-1/3 bg-[#111B21] text-white flex flex-col">
        <header className="px-4 py-3 bg-[#202C33] flex justify-between items-center">
          <h2 className="font-semibold">Chats</h2>
          <RefreshButton onClick={handleRefresh} refreshing={refreshing} />
        </header>

        {/* Pending Requests */}
        {pendingChats.length > 0 && (
          <>
            <div className="px-3 py-2 text-xs text-gray-400">Pending Requests</div>
            {pendingChats.map((m) => (
              <div
                key={m.id}
                className="px-4 py-3 hover:bg-[#2A3942] border-b border-gray-800"
              >
                <div className="flex justify-between items-center">
                  <span>{getUserName(m.sender_id)}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDecision(m.id, "accepted")}
                      className="bg-green-500 hover:bg-green-600 text-xs px-2 py-1 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecision(m.id, "rejected")}
                      className="bg-red-500 hover:bg-red-600 text-xs px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Active Chats */}
        <div className="px-3 py-2 text-xs text-gray-400">Active Chats</div>
        {activeChats.length ? (
          activeChats.map((m) => {
            const chatPartner = getUserName(
              m.sender_id === user.id ? m.receiver_id : m.sender_id
            );
            return (
              <div
                key={m.id}
                onClick={() => setActiveChat(m)}
                className={`px-4 py-3 cursor-pointer border-b border-gray-800 ${
                  activeChat?.id === m.id ? "bg-[#2A3942]" : "hover:bg-[#2A3942]"
                }`}
              >
                {chatPartner}
              </div>
            );
          })
        ) : (
          <p className="text-xs text-gray-500 px-4 py-3">No active chats</p>
        )}
      </aside>

      {/* RIGHT: Chat Window */}
      <main className="flex-1 flex flex-col bg-[#ECE5DD]">
        {activeChat ? (
          <ChatModal
            chat={activeChat}
            onClose={() => setActiveChat(null)}
            user={user}
            messages={messages}
            reload={reload}
            onViewProfile={onViewProfile}
            getUserName={getUserName}
          />
        ) : (
          <div className="flex items-center justify-center text-gray-500">
            Select a chat to start messaging 💬
          </div>
        )}
      </main>
    </section>
  );
}
