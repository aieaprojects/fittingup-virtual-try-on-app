import React, { createContext, useContext, useState } from 'react';

interface NotificationContextType {
  hasNewLooks: boolean;
  markLooksAsViewed: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [hasNewLooks, setHasNewLooks] = useState(false);
  
  // For now, we'll keep it simple and implement the backend query later
  // const backend = useBackend();
  
  const markLooksAsViewed = () => {
    setHasNewLooks(false);
    localStorage.setItem('lastViewedLooks', new Date().toISOString());
  };

  return (
    <NotificationContext.Provider value={{ hasNewLooks, markLooksAsViewed }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}