import { Routes, Route, Link } from "react-router-dom";
import PollList from "./components/PollList";
import PollDetail from "./components/PollDetail";
import CreatePoll from "./components/CreatePoll";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-white-800">
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <div className="text-xl font-bold">Poll App</div>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/create" className="hover:underline">
            Create Poll
          </Link>
        </div>
      </nav>
      <main className="p-4 max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<PollList />} />
          <Route path="/poll/:id" element={<PollDetail />} />
          <Route path="/create" element={<CreatePoll />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
