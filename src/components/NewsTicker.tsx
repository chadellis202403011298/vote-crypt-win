import { useEffect, useState } from "react";

// News ticker component for displaying breaking election updates
const NewsTicker = () => {
  const [tickerItems] = useState([
    "BREAKING: Early polling shows tight race in key swing states",
    "Voter turnout reaches historic highs in several districts",
    "LIVE: Real-time predictions now available on ElectionBet platform",
    "EXCLUSIVE: Encrypted betting ensures complete privacy and fairness",
    "ALERT: Market odds shift as new poll data emerges",
  ]);

  return (
    <div className="bg-ticker text-primary-foreground py-2 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap">
        {/* Duplicate items for seamless loop */}
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div key={index} className="inline-flex items-center px-8">
            <span className="text-secondary font-bold mr-2">●</span>
            <span className="text-sm font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
