import { useEffect, useState } from "react";
import io from "socket.io-client";

interface Rule {
  text: string;
  rule: {
    content: string;
    type: string;
    metadata: {
      author: string;
      timestamp: string;
    };
  };
  timestamp: string;
}

export function RuleLog() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setConnected(false);
    });

    socket.on("newRule", (rule: Rule) => {
      console.log("Received new rule:", rule);
      setRules((prevRules) => [...prevRules, rule]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="fixed right-0 top-0 w-[400px] h-screen bg-slate-900 shadow-lg">
      <div className="sticky top-0 bg-slate-900/50 backdrop-blur-sm z-10 px-6 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">
            Rule Vector Storage Log
          </h2>
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-emerald-400" : "bg-rose-400"
            }`}
            title={connected ? "Connected" : "Disconnected"}
          />
        </div>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-64px)] ">
        {rules.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 text-sm">Waiting for rules...</p>
          </div>
        ) : (
          rules.map((rule, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/20 overflow-hidden"
            >
              <div className="p-4">
                {/* Rule Type Badge */}
                <div className="inline-block px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs font-medium mb-3">
                  {rule.rule.type}
                </div>

                {/* Rule Content */}
                <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                  <p className="text-slate-100 font-medium leading-relaxed">
                    {rule.rule.content}
                  </p>
                </div>

                {/* Original Text */}
                <div className="bg-slate-800/30 rounded p-2 mb-3">
                  <p className="text-slate-300 text-sm">{rule.text}</p>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    {rule.rule.metadata.author}
                  </span>
                  <time className="text-slate-500">
                    {new Date(rule.timestamp).toLocaleString()}
                  </time>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
