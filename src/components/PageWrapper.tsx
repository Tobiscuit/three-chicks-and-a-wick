// src/components/PageWrapper.tsx
'use client';

import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Header onMobileMenuToggle={setMobileMenuOpen} isMobileMenuOpen={isMobileMenuOpen} />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
} 