import { useState } from 'react';

export type NotificationData = {
  id: string;
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  txHash?: string;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const extractMainHash = (hash: string) => {
    return hash.slice(0, 66);
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = (message: string, type: 'success' | 'error', txHash?: string) => {
    const id = generateId();
    setNotifications(prev => [...prev, {
      id,
      message,
      type,
      isVisible: true,
      txHash
    }]);

    setTimeout(() => {
      removeNotification(id);
    }, 6000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    extractMainHash
  };
}