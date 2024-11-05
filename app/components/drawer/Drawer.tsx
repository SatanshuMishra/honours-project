"use client";

import { useEffect, useState } from 'react';

export function Drawer({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock body scroll when drawer is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            style={{ zIndex: 49 }}
            onClick={onClose}
          />
          
          {/* Drawer Panel */}
          <div
            className="fixed left-0 right-0 bottom-0 w-full bg-white shadow-lg"
            style={{
              zIndex: 50,
              height: '50vh',  // Explicit viewport height
              maxHeight: '80vh',
              transform: `translateY(${isOpen ? '0' : '100%'})`,
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            {/* Handle */}
            <div className="sticky top-0 w-full flex justify-center p-4 bg-white">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            {/* Scrollable Content */}
            <div 
              className="overflow-y-auto"
              style={{
                height: 'calc(50vh - 3rem)', // Account for handle height
                maxHeight: 'calc(80vh - 3rem)'
              }}
            >
              <div className="px-6">
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}