import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, options }),
    });
    if (res.ok) navigate("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-bold">Create a Poll</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Poll question"
        className="w-full p-2 border rounded"
        required
      />
      {options.map((opt, idx) => (
        <input
          key={idx}
          type="text"
          value={opt}
          onChange={(e) => handleOptionChange(idx, e.target.value)}
          placeholder={`Option ${idx + 1}`}
          className="w-full p-2 border rounded"
          required
        />
      ))}
      <button
        type="button"
        onClick={addOption}
        className="bg-green-500 text-black p-2 rounded hover:bg-green-600"
      >
        Add Option
      </button>
      <button
        type="submit"
        className="bg-blue-500 text-black p-2 rounded hover:bg-blue-600"
      >
        Create Poll
      </button>
    </form>
  );
};

export default CreatePoll;
