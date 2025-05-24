import { RuleLog } from "./components/RuleLog";

function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-8">
          Engineering Rules Dashboard
        </h1>
        <RuleLog />
      </main>
    </div>
  );
}

export default App;
