'use client';

import Link from 'next/link';

export default function MagicRequestCard() {
	return (
		<Link
			href="/magic-request"
			className="group block rounded-2xl p-6 shadow-md border-2 border-cream bg-gradient-to-b from-[#FEF9E7] to-[rgba(242,82,135,0.06)] relative overflow-hidden"
			style={{ boxShadow: '0 0 0 0 rgba(249,212,35,0.0)' }}
		>
			<div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:animate-pulse-glow" />
			<div className="flex flex-col items-center text-center gap-3">
				<div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-sm">
					<span aria-hidden className="text-2xl" style={{ color: '#343A40' }}>✨</span>
				</div>
				<h3 className="font-headings text-2xl font-bold" style={{ fontFamily: 'Nunito, sans-serif', color: '#343A40' }}>
					Create Your Own Magic
				</h3>
				<p className="text-sm" style={{ fontFamily: 'Poppins, system-ui, sans-serif', color: '#343A40' }}>
					Tell us your idea, and we&apos;ll craft a unique candle just for you.
				</p>
				<span className="mt-1 inline-flex items-center gap-1 text-primary font-semibold">
					Start now
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M13 5l7 7-7 7" stroke="#F25287" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
				</span>
			</div>
			<style jsx>{`
				@keyframes glowPulse { 0% { box-shadow: 0 0 0 0 rgba(249, 212, 35, 0.25); } 50% { box-shadow: 0 0 24px 6px rgba(249, 212, 35, 0.35); } 100% { box-shadow: 0 0 0 0 rgba(249, 212, 35, 0.25); } }
				:global(.group:hover) { animation: glowPulse 2.5s ease-in-out infinite; }
			`}</style>
		</Link>
	);
}


