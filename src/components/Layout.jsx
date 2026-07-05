import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;

      setIsMobile(mobile);

      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        closeMobileMenu={() => setMobileMenuOpen(false)}
      />

      {/* Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={`
          min-h-screen
          bg-gray-100
          transition-all
          duration-300
          ${
            isMobile
              ? "pt-16"
              : collapsed
              ? "ml-20"
              : "ml-64"
          }
        `}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;