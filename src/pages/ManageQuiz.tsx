import { useEffect, useState, ChangeEvent, FormEvent } from "react";

const API=import.meta.env.VITE_API_URL


interface Quiz {
  quizId: number;
  title: string;
  totalMarks: number;
  duration: number;
  Subject: {
    subjectName: string;
    courseCode: string;
  };
}

const ManageQuiz = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    totalMarks: "",
    duration: "",
  });

  // Fetch all quizzes
  const getQuizzes = async () => {
    try {
      const response = await fetch(
        `${API}/quiz/getquiz`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        setQuizzes(result.data || []);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch quizzes");
    }
  };

  useEffect(() => {
    getQuizzes();
  }, []);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleEdit = (quiz: Quiz) => {
    setEditingId(quiz.quizId);

    setFormData({
      title: quiz.title,
      totalMarks: String(quiz.totalMarks),
      duration: String(quiz.duration),
    });
  };


  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingId) return;

    try {
      const response = await fetch(
        `${API}/quiz/updatequiz/${editingId}`,
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
          title: "",
          totalMarks: "",
          duration: "",
        });

        getQuizzes();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API}/quiz/block/${id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        getQuizzes();
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
        Manage Quiz
      </h1>

      {editingId && (
        <form
          onSubmit={handleUpdate}
          className="border p-4 rounded mb-5 space-y-3"
        >
          <h2 className="text-lg font-semibold">
            Edit Quiz
          </h2>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Quiz Title"
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            name="totalMarks"
            value={formData.totalMarks}
            onChange={handleChange}
            placeholder="Total Marks"
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration (minutes)"
            className="w-full border p-2 rounded"
            required
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Quiz
          </button>
        </form>
      )}

      {/* Quiz Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Quiz Title</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Course Code</th>
            <th className="border p-2">Total Marks</th>
            <th className="border p-2">Duration</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.quizId}>
              <td className="border p-2">
                {quiz.title}
              </td>

              <td className="border p-2">
                {quiz.Subject.subjectName}
              </td>

              <td className="border p-2">
                {quiz.Subject.courseCode}
              </td>

              <td className="border p-2">
                {quiz.totalMarks}
              </td>

              <td className="border p-2">
                {quiz.duration} minutes
              </td>

              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(quiz)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(quiz.quizId)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {quizzes.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No Quiz Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageQuiz;