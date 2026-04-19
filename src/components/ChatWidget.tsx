'use client';

import { useState, useRef, useEffect, type ReactElement } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function renderMarkdown(text: string) {
  // Markdown-Links [text](url) und **bold** parsen
  const parts: (string | ReactElement)[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Links [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

    // Finde den frühesten Match
    const boldIdx = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
    const linkIdx = linkMatch ? remaining.indexOf(linkMatch[0]) : Infinity;

    if (boldIdx === Infinity && linkIdx === Infinity) {
      parts.push(remaining);
      break;
    }

    if (linkIdx <= boldIdx && linkMatch) {
      parts.push(remaining.slice(0, linkIdx));
      parts.push(
        <a key={key++} href={linkMatch[2]} className="text-[var(--gold)] underline hover:text-gray-900 transition-colors" onClick={(e) => { e.stopPropagation(); }}>
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkIdx + linkMatch[0].length);
    } else if (boldMatch) {
      parts.push(remaining.slice(0, boldIdx));
      parts.push(<strong key={key++} className="font-semibold text-gray-900">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldIdx + boldMatch[0].length);
    }
  }

  return parts;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('chat-messages');
      if (saved) try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    sessionStorage.setItem('chat-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-chat', handler);
    return () => window.removeEventListener('open-chat', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: data.error }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      }
    } catch {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Verbindungsfehler. Bitte versuche es erneut.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-4 right-4 md:top-16 md:bottom-auto md:right-6 z-[9999] w-[calc(100vw-2rem)] max-w-[380px] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{
            height: 'min(500px, calc(100vh - 12rem))',
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.15), 0 0 30px rgba(196, 34, 46, 0.1)',
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-3 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--red-main), var(--red-dark))' }}
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
              ⚽
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-white">T-EXPRESS24 Support</div>
              <div className="text-[11px] text-white/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">👋</div>
                <p className="text-sm text-gray-500 mb-4">
                  Hallo! Wie kann ich dir helfen?
                </p>
                <div className="space-y-2">
                  {[
                    'Habt ihr Trikots von Real Madrid?',
                    'Welche Retro-Trikots gibt es?',
                    'Wie funktionieren die Bundle-Rabatte?',
                    'Wie lange dauert die Lieferung?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                        setTimeout(() => {
                          setInput('');
                          const msgs: Message[] = [{ role: 'user', content: q }];
                          setMessages(msgs);
                          setLoading(true);
                          fetch('/api/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ messages: msgs }),
                          })
                            .then((r) => r.json())
                            .then((data) => {
                              setMessages([...msgs, { role: 'assistant', content: data.message || data.error }]);
                            })
                            .catch(() => {
                              setMessages([...msgs, { role: 'assistant', content: 'Verbindungsfehler.' }]);
                            })
                            .finally(() => setLoading(false));
                        }, 0);
                      }}
                      className="block w-full text-left px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-[var(--red-main)] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[var(--red-main)] text-white rounded-br-md'
                      : 'bg-[#f5f5f5] text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#f5f5f5] border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 flex-shrink-0" style={{ background: '#f5f5f5' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Schreib deine Frage..."
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-[16px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--red-main)] transition-colors"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
                style={{ background: 'var(--red-main)' }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
