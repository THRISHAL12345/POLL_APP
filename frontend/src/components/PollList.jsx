import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PollList = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/polls")
      .then((res) => res.json())
      .then(setPolls)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <div
          key={poll._id}
          className="bg-white p-4 rounded shadow hover:shadow-lg transition"
        >
          <Link
            to={`/poll/${poll._id}`}
            className="font-bold text-lg hover:underline"
          >
            {poll.question}
          </Link>
          <ul className="mt-2 space-y-1 text-gray-600">
            {poll.options.map((opt) => (
              <li key={opt._id}>
                {opt.text} — {opt.votes} votes
              </li>
            ))}
          </ul>
        </div>
      ))}
      {polls.length === 0 && <p>No polls yet.</p>}
    </div>
  );
};

export default PollList;
