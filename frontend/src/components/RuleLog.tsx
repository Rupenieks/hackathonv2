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
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-200">
          Rule Vector Storage Log
        </h2>
        <div
          className={`w-3 h-3 rounded-full ${
            connected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
          }`}
          title={connected ? "Connected" : "Disconnected"}
        />
      </div>

      <div className="space-y-6">
        {rules.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-slate-900/50 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-lg">Waiting for rules...</p>
          </div>
        ) : (
          rules.map((rule, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-4 py-1.5 bg-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium border border-indigo-500/30">
                    {rule.rule.type}
                  </span>
                  <time className="text-sm text-slate-400">
                    {new Date(rule.timestamp).toLocaleString()}
                  </time>
                </div>

                <div className="bg-white/5 rounded-lg p-4 mb-4 backdrop-blur-sm">
                  <p className="text-xl text-slate-100 font-medium leading-relaxed">
                    {rule.rule.content}
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                  <p className="text-base text-slate-300">{rule.text}</p>
                </div>

                <div className="flex items-center text-sm text-slate-400">
                  <span className="flex items-center gap-2">
                    Author: {rule.rule.metadata.author}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
