'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, User, Phone, Mail, Sparkles } from 'lucide-react';
import { generateAIConciergeReply } from '../../lib/aiConcierge';
import { sendCrmLead } from '../../lib/crmLeadHelper';

export default function ClientChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'lead_form' | 'chat'>('lead_form');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    initialMessage: ''
  });

  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'KnK Concierge',
      text: 'Welcome to KnK Automotive Enterprise. How can we assist you with our vehicle inventory today?',
      time: 'Just now'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Dispatch to Strapi CRM support API
      await fetch('http://localhost:1338/api/crm-support-threads/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.initialMessage || 'Started chat session',
          pageUrl: typeof window !== 'undefined' ? window.location.href : ''
        })
      }).catch(() => {});

      // Feed lead directly into Strapi CRM Leads API
      await sendCrmLead({
        name: form.name || 'Anonymous Storefront Visitor',
        phone: form.phone,
        email: form.email,
        source: 'Live AI Concierge Chat Widget',
        notes: form.initialMessage || 'Initiated live chat consultation session',
        intentScore: 75,
        intentTier: 'HIGH'
      });

      if (form.initialMessage) {
        const initialText = form.initialMessage;
        setMessages((prev) => [
          ...prev,
          { sender: form.name || 'Client', text: initialText, time: 'Just now' }
        ]);

        setAiTyping(true);
        generateAIConciergeReply(initialText, []).then((aiReply) => {
          setAiTyping(false);
          setMessages((prev) => [
            ...prev,
            { sender: 'KnK Concierge', text: aiReply, time: 'Just now' }
          ]);
        });
      }

      setStep('chat');
    } catch (err) {
      setStep('chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    setInputMsg('');

    const currentHistory = [...messages, { sender: form.name || 'Client', text: userText, time: 'Just now' }];
    setMessages(currentHistory);

    setAiTyping(true);
    try {
      const aiReply = await generateAIConciergeReply(userText, currentHistory);
      setMessages((prev) => [
        ...prev,
        { sender: 'KnK Concierge', text: aiReply, time: 'Just now' }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'KnK Concierge',
          text: 'Thank you for your inquiry. An executive sales advisor has received your request and will follow up directly.',
          time: 'Just now'
        }
      ]);
    } finally {
      setAiTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black p-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 font-bold text-xs tracking-wider"
          style={{ boxShadow: '0 10px 30px -5px rgba(201, 168, 76, 0.5)' }}
        >
          <MessageSquare size={22} className="fill-black" />
          <span className="hidden sm:inline uppercase">Live Concierge</span>
          <span className="absolute -top-1 -right-1 w-3 h-[#c9a84c] h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-[#0a0a0a] border border-[#c9a84c]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#111111] to-[#0a0a0a] border-b border-neutral-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c] flex items-center justify-center text-[#c9a84c] font-bold text-xs">
                KnK
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Executive Concierge</h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online Advisors Ready
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          {step === 'lead_form' ? (
            <form onSubmit={handleStartChat} className="p-5 flex-1 space-y-4 overflow-y-auto">
              <div className="text-xs text-neutral-300 bg-[#121212] border border-neutral-800 p-3 rounded-xl">
                <p className="font-semibold text-[#c9a84c]">Instant Showroom Inquiry</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Enter details to connect directly with our sales team.</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Your Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sir James Harrison"
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="james@example.com"
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">How can we help?</label>
                <textarea
                  rows={2}
                  value={form.initialMessage}
                  onChange={(e) => setForm({ ...form, initialMessage: e.target.value })}
                  placeholder="Inquiring about 2024 Mercedes S 580 pricing..."
                  className="w-full bg-[#141414] border border-neutral-800 focus:border-[#c9a84c] rounded-xl p-2.5 text-xs text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                {loading ? 'Connecting...' : 'Start Live Chat'}
              </button>
            </form>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'KnK Concierge' ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-xl text-xs ${
                        msg.sender === 'KnK Concierge'
                          ? 'bg-[#181818] border border-neutral-800 text-neutral-200'
                          : 'bg-[#c9a84c] text-black font-medium'
                      }`}
                    >
                      <p className="text-[10px] font-bold opacity-75 mb-0.5">{msg.sender}</p>
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-neutral-600 mt-1">{msg.time}</span>
                  </div>
                ))}
                {aiTyping && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#c9a84c] font-semibold bg-[#181818] p-2.5 rounded-xl border border-[#c9a84c]/30 animate-pulse w-fit">
                    <Sparkles size={14} className="animate-spin text-[#c9a84c]" />
                    <span>KnK Executive AI Concierge is typing...</span>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-[#111111] border-t border-neutral-800 flex gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 bg-[#181818] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#c9a84c] text-black rounded-xl text-xs font-bold hover:bg-[#e5c158]"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
