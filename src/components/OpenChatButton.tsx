'use client';

export default function OpenChatButton() {
  return (
    <button
      onClick={() => { window.dispatchEvent(new Event('open-chat')); window.location.href = '/'; }}
      className="text-[var(--gold)] font-semibold hover:underline cursor-pointer"
    >
      Chat-Berater
    </button>
  );
}
