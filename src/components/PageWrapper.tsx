// src/components/PageWrapper.tsx
'use client';

import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Cart from './Cart';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Header
        onMobileMenuToggle={setMobileMenuOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        onCartToggle={() => setCartOpen(true)}
      />
      <Cart open={isCartOpen} setOpen={setCartOpen} />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
} 