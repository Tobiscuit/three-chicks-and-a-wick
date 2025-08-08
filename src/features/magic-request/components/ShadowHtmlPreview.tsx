'use client';

import { useEffect, useRef } from 'react';

export default function ShadowHtmlPreview({ html }: { html: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
    // Clear previous content
    while (shadow.firstChild) shadow.removeChild(shadow.firstChild);

    // Basic sanitization: strip script tags and event handlers
    const sanitized = html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/ on\w+="[^"]*"/gi, '')
      .replace(/ on\w+='[^']*'/gi, '');

    const wrapper = document.createElement('div');
    wrapper.innerHTML = sanitized;
    shadow.appendChild(wrapper);
  }, [html]);

  return <div ref={hostRef} />;
}


