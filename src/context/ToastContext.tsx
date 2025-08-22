'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast from '@/components/ui/Toast';

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toastMessage, setToastMessage] = useState('');
  const [show, setShow] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setToastMessage('');
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toastMessage} show={show} onClose={handleClose} />
    </ToastContext.Provider>
  );
};

