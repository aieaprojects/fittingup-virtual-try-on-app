import React, { createContext, useContext, useState, useEffect } from 'react';

interface AvatarSelectionContextType {
  selectedAvatarId: number | null;
  setSelectedAvatarId: (id: number | null) => void;
  clearSelectedAvatar: () => void;
}

const AvatarSelectionContext = createContext<AvatarSelectionContextType | undefined>(undefined);

export function AvatarSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedAvatarId, setSelectedAvatarIdState] = useState<number | null>(null);

  // Load selected avatar from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('selectedAvatarId');
    if (stored) {
      setSelectedAvatarIdState(parseInt(stored));
    }
  }, []);

  const setSelectedAvatarId = (id: number | null) => {
    setSelectedAvatarIdState(id);
    if (id) {
      sessionStorage.setItem('selectedAvatarId', id.toString());
    } else {
      sessionStorage.removeItem('selectedAvatarId');
    }
  };

  const clearSelectedAvatar = () => {
    setSelectedAvatarId(null);
  };

  return (
    <AvatarSelectionContext.Provider value={{ 
      selectedAvatarId, 
      setSelectedAvatarId, 
      clearSelectedAvatar 
    }}>
      {children}
    </AvatarSelectionContext.Provider>
  );
}

export function useAvatarSelection() {
  const context = useContext(AvatarSelectionContext);
  if (context === undefined) {
    throw new Error('useAvatarSelection must be used within an AvatarSelectionProvider');
  }
  return context;
}