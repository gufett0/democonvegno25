import React from 'react';
import { Check, AlertCircle, ExternalLink } from 'lucide-react';

export type NotificationData = {
  id: string;
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  txHash?: string;
};

type NotificationStackProps = {
  notifications: NotificationData[];
  onClose: (id: string) => void;
};

const NotificationBanner = ({ notifications, onClose }: NotificationStackProps) => {
  if (!notifications.length) return null;

  const handleTxClick = (txHash: string) => {
    window.open(`https://base-sepolia.blockscout.com/tx/${txHash}`, '_blank');
};

  const formatMessage = (notification: NotificationData) => {
    if (!notification.txHash) return notification.message;

    const parts = notification.message.split(notification.txHash);
    return (
      <>
        {parts[0]}
        <button 
          onClick={() => handleTxClick(notification.txHash!)}
          className="inline-flex items-center gap-1 underline hover:text-blue-600"
        >
          {`${notification.txHash.slice(0, 6)}...${notification.txHash.slice(-4)}`}
          <ExternalLink className="h-3 w-3" />
        </button>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-50 space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`transition-all duration-300 ${
            notification.isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
          }`}
        >
          <div
            className={`
              rounded-lg border p-4 shadow-lg
              ${notification.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
              }
            `}
            role="alert"
          >
            <div className="flex items-start gap-2">
              {notification.type === 'success' ? (
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium break-all">
                {formatMessage(notification)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationBanner;