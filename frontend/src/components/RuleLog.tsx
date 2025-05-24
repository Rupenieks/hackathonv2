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
    const socket = io("http://localhost:3000"); // adjust port as needed

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
    <div className="fixed right-0 top-0 w-96 h-screen p-6 bg-gray-50 overflow-y-auto border-l border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold">Engineering Rules Log</h2>
        <div
          className={`w-2 h-2 rounded-full ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}
          title={connected ? "Connected" : "Disconnected"}
        />
      </div>

      {rules.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No rules received yet. Waiting for updates...
        </p>
      ) : (
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <p className="text-sm text-gray-600 mb-2">
                {new Date(rule.timestamp).toLocaleString()}
              </p>
              <p className="font-medium mb-2">{rule.rule.content}</p>
              <div className="flex gap-2 text-sm text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  Type: {rule.rule.type}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  Author: {rule.rule.metadata.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
