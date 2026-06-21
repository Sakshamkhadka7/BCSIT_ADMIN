import { useEffect, useState, ChangeEvent, FormEvent } from "react";

const API=import.meta.env.VITE_API_URL


interface QuizQuestion {
  quizQuestionId: number;
  question: string;
  answer: string;
  optionA: string;
  optionB: string;
  optionC: string;
  Quiz: {
    title: string;
    totalMarks: number;
    duration: number;
  };
}

const ManageQuizQuestion = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    optionA: "",
    optionB: "",
    optionC: "",
  });

  // Fetch all questions
  const getQuestions = async () => {
    try {
      const response = await fetch(
        `${API}/quizques/getallquestion`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        setQuestions(result.data.rows || []);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch questions");
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  // Input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Open edit form
  const handleEdit = (item: QuizQuestion) => {
    setEditingId(item.quizQuestionId);

    setFormData({
      question: item.question,
      answer: item.answer,
      optionA: item.optionA,
      optionB: item.optionB,
      optionC: item.optionC,
    });
  };

  // Update question
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingId) return;

    try {
      const response = await fetch(
        `${API}/quizques/updatequizques/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);

        setEditingId(null);

        setFormData({
          question: "",
          answer: "",
          optionA: "",
          optionB: "",
          optionC: "",
        });

        getQuestions();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  // Delete (soft delete)
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API}/quizques/block/${id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        getQuestions();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">
        Manage Quiz Questions
      </h1>

      {editingId && (
        <form
          onSubmit={handleUpdate}
          className="border p-4 rounded mb-5 space-y-3"
        >
          <h2 className="text-lg font-semibold">
            Edit Question
          </h2>

          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Question"
          />
             <label>Option A</label>
          <input
            type="text"
            name="optionA"
            value={formData.optionA}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Option A"
          />
            <label>Option B</label>
          <input
            type="text"
            name="optionB"
            value={formData.optionB}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Option B"
          />
          <label>Option C</label>
          <input
            type="text"
            name="optionC"
            value={formData.optionC}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Option C"
          />
            <label>Correct Answer</label>
          <input
            type="text"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Correct Answer"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Question
          </button>
        </form>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Quiz</th>
            <th className="border p-2">Question</th>
            <th className="border p-2">Option A</th>
            <th className="border p-2">Option B</th>
            <th className="border p-2">Option C</th>
            <th className="border p-2">Answer</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {questions.map((item) => (
            <tr key={item.quizQuestionId}>
              <td className="border p-2">
                {item.Quiz.title}
              </td>

              <td className="border p-2">
                {item.question}
              </td>

              <td className="border p-2">
                {item.optionA}
              </td>

              <td className="border p-2">
                {item.optionB}
              </td>

              <td className="border p-2">
                {item.optionC}
              </td>

              <td className="border p-2">
                {item.answer}
              </td>

              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.quizQuestionId)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {questions.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-4">
                No Quiz Questions Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageQuizQuestion;