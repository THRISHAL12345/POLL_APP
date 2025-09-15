import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const socket = io("http://localhost:3000");

const PollDetail = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/polls/${id}`)
      .then((res) => res.json())
      .then(setPoll)
      .catch(console.error);

    socket.emit("joinPoll", id);
    socket.on("voteUpdate", setPoll);

    return () => socket.off("voteUpdate");
  }, [id]);

  const vote = (index) => {
    fetch(`http://localhost:3000/polls/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionIndex: index }),
    });
  };

  if (!poll) return <p>Loading poll...</p>;

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">{poll.question}</h2>

      <div className="space-y-2">
        {poll.options.map((opt, idx) => (
          <button
            key={opt._id}
            onClick={() => vote(idx)}
            className="w-full bg-blue-500 text-black p-2 rounded hover:bg-blue-600"
          >
            {opt.text} — {opt.votes} votes
          </button>
        ))}
      </div>

      <h3 className="mt-4 font-bold">Results</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={poll.options}>
          <XAxis dataKey="text" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="votes" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PollDetail;
