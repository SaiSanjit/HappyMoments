"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { CRMChatRoom, CRMMessage } from "@/lib/crm-types";
import { getChatRooms, getMessages, sendMessage } from "@/services/crm";
import { supabase } from "@/lib/supabase";
import { useVendorAuth } from "@/contexts/VendorAuth";
import { useResourceAuth } from "@/contexts/ResourceAuth";
import { MessageSquare, Send, RefreshCw } from "lucide-react";

interface Props { vendorId: string; }

export default function ChatsPage({ vendorId }: Props) {
  const { vendor } = useVendorAuth();
  const { resource } = useResourceAuth();

  const [rooms, setRooms] = useState<CRMChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<CRMChatRoom | null>(null);
  const [messages, setMessages] = useState<CRMMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const senderId = vendor?.vendor_id || resource?.resource_id || "";
  const senderName = vendor?.brand_name || resource?.resource_name || "Vendor";

  const loadRooms = useCallback(async () => {
    setLoadingRooms(true);
    const data = await getChatRooms(vendorId);
    setRooms(data);
    setLoadingRooms(false);
  }, [vendorId]);

  const loadMessages = useCallback(async (room: CRMChatRoom) => {
    setLoadingMessages(true);
    const msgs = await getMessages(room.id);
    setMessages(msgs);
    setLoadingMessages(false);
  }, []);

  useEffect(() => { loadRooms(); }, [loadRooms]);

  useEffect(() => {
    if (!selectedRoom) return;
    loadMessages(selectedRoom);

    const channel = supabase
      .channel(`room-${selectedRoom.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "crm_messages", filter: `room_id=eq.${selectedRoom.id}` },
        (payload) => {
          setMessages((prev) => {
            if (prev.find((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new as CRMMessage];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedRoom, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedRoom) return;
    setSending(true);
    const text = newMessage.trim();
    setNewMessage("");

    // Optimistic
    const optimistic: CRMMessage = {
      id: `optimistic-${Date.now()}`,
      room_id: selectedRoom.id,
      sender_type: "resource",
      sender_id: senderId,
      sender_name: senderName,
      message: text,
      read_by: {},
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    await sendMessage(selectedRoom.id, "resource", senderId, senderName, text);
    setSending(false);
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="flex h-full overflow-hidden">
      {/* Room list */}
      <div
        className="w-72 shrink-0 flex flex-col border-r"
        style={{ borderColor: "var(--border3)", background: "var(--bg2)" }}
      >
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border3)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Chats</h2>
          <button onClick={loadRooms} style={{ color: "var(--text-muted)" }}>
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingRooms ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="mx-3 my-2 h-14 rounded-lg animate-pulse" style={{ background: "var(--bg)" }} />
            ))
          ) : rooms.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12">
              <MessageSquare size={32} style={{ color: "var(--text-muted)" }} />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>No chats yet</p>
            </div>
          ) : (
            rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className="w-full px-4 py-3 text-left transition-colors hover:opacity-90"
                style={{
                  background: selectedRoom?.id === room.id ? "var(--gold-soft)" : "transparent",
                  borderBottom: "1px solid var(--border3)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium" style={{ color: "var(--text)" }}>
                      {room.customer_name || "Internal"}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase"
                        style={{
                          background: room.room_type === "lead" ? "#e0f2fe" : room.room_type === "opportunity" ? "#ede9fe" : "#dcfce7",
                          color: room.room_type === "lead" ? "#0369a1" : room.room_type === "opportunity" ? "#6d28d9" : "#15803d",
                        }}
                      >
                        {room.room_type.replace("_", " ")}
                      </span>
                    </div>
                    {room.last_message && (
                      <p className="truncate text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {room.last_message}
                      </p>
                    )}
                  </div>
                  {room.unread_count > 0 && (
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
                      style={{ background: "var(--gold)" }}
                    >
                      {room.unread_count}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedRoom ? (
          <>
            <div
              className="flex items-center gap-3 px-5 py-3 shrink-0"
              style={{ borderBottom: "1px solid var(--border3)", background: "var(--bg2)" }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {selectedRoom.customer_name || "Internal Chat"}
                </p>
                <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
                  {selectedRoom.room_type.replace("_", " ")} · {selectedRoom.reference_type}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {loadingMessages ? (
                <div className="flex justify-center py-10">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
                </div>
              ) : messages.length === 0 ? (
                <p className="text-center text-sm py-10" style={{ color: "var(--text-muted)" }}>No messages yet</p>
              ) : (
                <>
                  {messages.map((msg, i) => {
                    const isOwn = msg.sender_id === senderId;
                    const prevMsg = messages[i - 1];
                    const showDate = !prevMsg || formatDate(msg.created_at) !== formatDate(prevMsg.created_at);
                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 h-px" style={{ background: "var(--border3)" }} />
                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{formatDate(msg.created_at)}</span>
                            <div className="flex-1 h-px" style={{ background: "var(--border3)" }} />
                          </div>
                        )}
                        <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-xs rounded-2xl px-4 py-2.5 ${isOwn ? "rounded-br-sm" : "rounded-bl-sm"}`}
                            style={{
                              background: isOwn ? "var(--gold)" : "var(--bg2)",
                              border: isOwn ? "none" : "1px solid var(--border3)",
                            }}>
                            {!isOwn && (
                              <p className="text-[10px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                                {msg.sender_name}
                              </p>
                            )}
                            <p className="text-sm leading-relaxed" style={{ color: isOwn ? "#000" : "var(--text)" }}>
                              {msg.message}
                            </p>
                            <p className="text-[10px] mt-1" style={{ color: isOwn ? "rgba(0,0,0,0.5)" : "var(--text-muted)", textAlign: isOwn ? "right" : "left" }}>
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            <div className="shrink-0 px-5 py-3" style={{ borderTop: "1px solid var(--border3)", background: "var(--bg2)" }}>
              <div className="flex items-end gap-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a message…"
                  rows={1}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)", maxHeight: "120px" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-opacity disabled:opacity-40"
                  style={{ background: "var(--gold)" }}
                >
                  <Send size={16} style={{ color: "#000" }} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <MessageSquare size={48} style={{ color: "var(--text-muted)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
