const MobileHeader = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gray-800 text-white flex items-center justify-between px-4 shadow-md z-40 md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={onMenuClick}
        className="text-2xl hover:text-blue-400 transition"
      >
        ☰
      </button>

      {/* Brand */}
      <div className="text-center">
        <h1 className="text-lg font-bold">WelfareHub</h1>
        <p className="text-xs text-gray-400">
          Management System
        </p>
      </div>

      {/* Spacer (keeps brand centered) */}
      <div className="w-8"></div>
    </header>
  );
};

export default MobileHeader;