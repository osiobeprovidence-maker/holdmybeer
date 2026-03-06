import React, { createContext, useContext, ReactNode } from 'react';
import { Toaster, toast } from 'sonner';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  description?: string;
}

interface NotificationContextType {
  notify: (message: string, type: NotificationType, options?: NotificationOptions) => void;
  success: (message: string, options?: NotificationOptions) => void;
  error: (message: string, options?: NotificationOptions) => void;
  info: (message: string, options?: NotificationOptions) => void;
  warning: (message: string, options?: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const notify = (message: string, type: NotificationType = 'info', options?: NotificationOptions) => {
    const { duration = 4000, action, description } = options || {};

    const toastOptions = {
      duration,
      description,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      case 'info':
      default:
        toast.info(message, toastOptions);
        break;
    }
  };

  const value: NotificationContextType = {
    notify,
    success: (msg, opts) => notify(msg, 'success', opts),
    error: (msg, opts) => notify(msg, 'error', opts),
    info: (msg, opts) => notify(msg, 'info', opts),
    warning: (msg, opts) => notify(msg, 'warning', opts),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster 
        position="top-right"
        theme="light"
        richColors
        expand={true}
        closeButton
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
