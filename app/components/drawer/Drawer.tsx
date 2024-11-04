const Drawer = ({ isOpen, onClose, children }: any) => {
  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-[9999]"
            onClick={onClose}
          />
          <div
            className={`
              fixed bottom-0 left-0 right-0 
              w-full h-1/2 
              bg-white
              shadow-lg 
              transform transition-transform duration-300 ease-in-out
              z-[10000]
              ${isOpen ? 'translate-y-0' : 'translate-y-full'}
            `}
          >
            <div className="w-full flex justify-center p-4">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-6 overflow-y-auto h-[calc(100%-2rem)]">
              {children}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Drawer;
