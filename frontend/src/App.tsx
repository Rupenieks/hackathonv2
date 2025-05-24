import { RuleLog } from "./components/RuleLog";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 pr-96">
        <h1 className="text-3xl font-bold mb-8">Engineering Dashboard</h1>
        <div className="prose max-w-none">
          <p>
            Welcome to the Engineering Dashboard. This dashboard displays
            real-time updates of engineering rules and decisions as they are
            added to our system.
          </p>
          <p>
            The log panel on the right shows all incoming rules in real-time.
          </p>
        </div>
      </main>
      <RuleLog />
    </div>
  );
}

export default App;
