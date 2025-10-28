import { ReactNode } from "react";
import NewsTicker from "./NewsTicker";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout wrapper with header, ticker, and footer
 * Includes RainbowKit wallet connection in the header
 */
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Wallet Connect */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-primary hover:opacity-80 transition-opacity">
            ElectionBet
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/app" className="text-sm font-medium hover:text-primary transition-colors">
              Predict
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ConnectButton
              accountStatus="address"
              chainStatus="icon"
              showBalance={false}
            />
          </div>
        </div>
      </header>

      {/* Ticker */}
      <NewsTicker />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <Link to="/" className="text-2xl font-black">
                ElectionBet
              </Link>
              <p className="text-sm text-primary-foreground/70 mt-1">
                Encrypted election predictions powered by FHE
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <Link to="/app" className="hover:underline">
                Predict
              </Link>
              <a href="#" className="hover:underline">
                Methodology
              </a>
              <a href="#" className="hover:underline">
                Docs
              </a>
            </div>
          </div>
          <div className="text-center text-xs text-primary-foreground/50 mt-6">
            © 2024 ElectionBet. All predictions are encrypted on-chain.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
