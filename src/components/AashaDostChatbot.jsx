import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, HeartPulse, MessageCircle, Send, Shield, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const quickPrompts = [
  'I have fever and cough',
  'Book a lab test',
  'I have chest discomfort',
  'How to manage diabetes?',
  'Need mental wellbeing tips',
  'When to see a doctor?'
];

const guidanceBlocks = [
  {
    keywords: ['chest', 'breath', 'breathing', 'stroke', 'numb', 'faint', 'severe pain'],
    reply:
      'This sounds urgent. If you have chest pain, shortness of breath, weakness on one side, or fainting, please call emergency services immediately or visit the nearest ER. For a doctor consult, I can help book a cardiology slot.'
  },
  {
    keywords: ['fever', 'cough', 'cold', 'flu'],
    reply:
      'For fever or cough: keep hydrated, rest, and use paracetamol if no allergy. Watch for high fever (>103°F), breathlessness, or worsening cough — seek a doctor if present. Want me to suggest relevant tests like CBC/CRP or book a consult?'
  },
  {
    keywords: ['covid', 'corona'],
    reply:
      'If COVID is suspected: isolate, wear a mask, hydrate, and monitor SpO₂. Get an antigen/RT-PCR if symptoms appear. Seek urgent care if SpO₂ < 94%, severe breathlessness, or chest pain.'
  },
  {
    keywords: ['diabetes', 'sugar', 'glucose'],
    reply:
      'For diabetes: keep regular meals, monitor fasting/post-meal sugars, stay active 30 mins/day, and never stop prescribed meds without your doctor. Consider HbA1c, fasting, and post-prandial tests every 3 months. I can help list nearby labs.'
  },
  {
    keywords: ['bp', 'blood pressure', 'hypertension'],
    reply:
      'For high BP: reduce salt, avoid added caffeine, continue prescribed meds on time, and track readings. If BP is >180/120 with chest pain, vision changes, or breathlessness, seek ER care immediately.'
  },
  {
    keywords: ['stress', 'anxiety', 'mental', 'sleep', 'insomnia'],
    reply:
      'For stress or poor sleep: follow a fixed sleep schedule, limit screens 1 hour before bed, try 4-7-8 breathing, and keep caffeine low after noon. Reach out if you feel unsafe — crisis lines and professionals can help.'
  },
  {
    keywords: ['stomach', 'abdomen', 'abdominal', 'vomit', 'diarrhea', 'loose motion', 'nausea'],
    reply:
      'For stomach issues: sip ORS, avoid heavy or oily foods, and monitor urine output. If severe abdominal pain, continuous vomiting, blood in stool, or dehydration, seek medical care. I can help arrange a consultation or stool panel.'
  },
  {
    keywords: ['period', 'pregnancy', 'pregnant', 'menstrual', 'cramp'],
    reply:
      'For period cramps: warm compress, light stretching, and hydration often help. If pain is severe, cycles are very heavy, or you might be pregnant with pain/bleeding, please see a gynaecologist urgently.'
  },
  {
    keywords: ['skin', 'rash', 'allergy', 'itch'],
    reply:
      'For mild rashes: keep the area cool, avoid new cosmetics, and consider an antihistamine if previously tolerated. If swelling of lips/eyes, breathing trouble, or rapidly spreading rash, seek emergency care.'
  },
  {
    keywords: ['test', 'lab', 'diagnostic', 'blood test'],
    reply:
      'I can help shortlist tests. Common panels: CBC, CRP, LFT, KFT, HbA1c, lipid profile, thyroid profile. Tell me the symptom and I will suggest a focused set or help you browse the Test Price List.'
  },
  {
    keywords: ['doctor', 'appointment', 'consult'],
    reply:
      'I can connect you to the right specialist. Tell me your main concern (e.g., chest pain → cardiology, stomach pain → gastro/medicine, skin rash → dermatology). I can also guide you to our booking page.'
  }
];

const defaultReply =
  'Thanks for sharing. I am AASHA DOST — I can guide you with first steps, tests to consider, and when to see a clinician. Tell me your main symptom, any chronic conditions, medicines you take, and if this feels urgent.';

const emergencyFooter =
  'Emergency? Call local emergency services or go to the nearest hospital. AI guidance is not a substitute for doctor advice.';

const buildReply = (text) => {
  const normalized = (text || '').toLowerCase();
  if (!normalized.trim()) return defaultReply;

  const block = guidanceBlocks.find(entry => entry.keywords.some(key => normalized.includes(key)));
  const base = block ? block.reply : defaultReply;

  const needsUrgent = ['chest pain', 'short of breath', 'breathless', 'stroke', 'numb', 'faint', 'severe', 'bleeding', 'vision loss']
    .some(term => normalized.includes(term));

  const nextStep = normalized.includes('book') || normalized.includes('appointment')
    ? 'I can open the booking flow or suggest a specialist if you share your city.'
    : 'If you want, I can recommend tests or help you book a doctor visit.';

  return `${needsUrgent ? emergencyFooter + ' ' : ''}${base} ${nextStep}`.trim();
};

const AashaDostChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi, I am AASHA DOST. Tell me your symptom, and I will guide you with first steps, when to see a doctor, and tests to consider.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const liveTips = useMemo(
    () => ['Hydrate well', 'Monitor symptoms', 'Avoid self-medicating', 'Rest and breathe slow'],
    []
  );

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textOverride) => {
    const messageText = (textOverride ?? input).trim();
    if (!messageText) return;

    setMessages(prev => [...prev, { from: 'user', text: messageText }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = buildReply(messageText);
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
      setIsTyping(false);
    }, 550 + Math.random() * 400);
  };

  const handlePrompt = (prompt) => {
    handleSend(prompt);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed right-6 bottom-24 z-50 flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="aasha-dost-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            id="aasha-dost-panel"
            className="w-[92vw] max-w-sm md:max-w-md shadow-soft bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden pointer-events-auto"
          >
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-600/95 via-emerald-500/95 to-emerald-600/95 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/15 p-2 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AASHA DOST AI</p>
                  <p className="text-[11px] text-emerald-50 flex items-center gap-1">
                    <span className="w-2 h-2 bg-lime-300 rounded-full animate-pulse"></span>
                    Online now · Safe guidance
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/15 transition"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 pt-3 pb-2">
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handlePrompt(prompt)}
                    className="text-xs px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div
              ref={scrollRef}
              className="px-4 pb-3 space-y-3 max-h-80 overflow-y-auto"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm shadow-sm max-w-[85%] ${
                      message.from === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/85 border border-emerald-50 text-slate-800 backdrop-blur'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  Typing guidance...
                </div>
              )}
            </div>

            <div className="px-4 pb-4">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 bg-white/85 backdrop-blur rounded-xl px-3 py-2 border border-emerald-50 shadow-inner"
              >
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your symptom or question"
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                />
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white w-10 h-10 p-0 rounded-xl"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] text-slate-500">{emergencyFooter}</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <Shield className="w-3 h-3" />
                  <HeartPulse className="w-3 h-3" />
                  <Activity className="w-3 h-3" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-emerald-700">
                {liveTips.map((tip) => (
                  <span key={tip} className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100">{tip}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-full shadow-lg shadow-red-500/25 border border-white/30 backdrop-blur-md hover:bg-red-700"
        aria-expanded={isOpen}
        aria-controls="aasha-dost-panel"
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-sm font-semibold">Ask AASHA DOST</span>
        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">AI helper</span>
      </motion.button>
    </div>
  );
};

export default AashaDostChatbot;
