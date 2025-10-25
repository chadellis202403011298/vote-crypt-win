import { ReactNode } from "react";
import NewsTicker from "./NewsTicker";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

// Main layout wrapper with ticker and footer
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
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
