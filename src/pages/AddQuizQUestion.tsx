import { useEffect, useState, ChangeEvent, FormEvent } from "react";

const API=import.meta.env.VITE_API_URL


interface Quiz {
  quizId: string;
  title: string;
  totalMarks: number;
  duration: number;
  subjectId: string;
}

interface Subject {
  subjectId: string;
  subjectName: string;
  courseCode: string;
  semesterId: string;
}

interface Semester {
  semesterId: string;
  semesterNumber: number;
}

interface QuizQuestionForm {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  answer: string;
  quizId: string;
  semesterId: string;
  subjectId: string;
  quizquesFile: File | null;
}

const AddQuizQuestion = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<QuizQuestionForm>({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    answer: "",
    quizId: "",
    semesterId: "",
    subjectId: "",
    quizquesFile: null,
  });

  const getSemester = async () => {
    const res = await fetch(`${API}/sem/getSemester`, {
      credentials: "include",
    });

    const data = await res.json();

    setSemesters(data.data || []);
  };

  const getSubjects = async () => {
    const res = await fetch(`${API}/sub/getsubject`, {
      credentials: "include",
    });

    const data = await res.json();

    setSubjects(data.data || []);
  };

  const getQuiz = async () => {
    const res = await fetch(`${API}/quiz/getquiz`, {
      credentials: "include",
    });

    const data = await res.json();

    setQuizzes(data.data || []);
  };

  useEffect(() => {
    getSemester();
    getSubjects();
    getQuiz();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const target = e.target as HTMLInputElement;

    const { name, value, files } = target;

    if (files && files.length > 0) {
      const selectedFile = files[0];

      setFormData((prev) => ({
        ...prev,
        [name]: selectedFile,
      }));

      const preview = URL.createObjectURL(selectedFile);

      setFilePreview(preview);

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = new FormData();

      payload.append("question", formData.question);

      payload.append("optionA", formData.optionA);

      payload.append("optionB", formData.optionB);

      payload.append("optionC", formData.optionC);

      payload.append("answer", formData.answer);

      payload.append("quizId", formData.quizId);

      if (formData.quizquesFile) {
        payload.append("quizquesFile", formData.quizquesFile);
      }

      const response = await fetch(
        `${API}/quizques/create`,
        {
          method: "POST",

          credentials: "include",

          body: payload,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert(result.message);

      setFormData({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        answer: "",
        quizId: "",
        semesterId: "",
        subjectId: "",
        quizquesFile: null,
      });

      setFilePreview(null);
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  };

  const filteredSubjects = subjects.filter(
    (subject) => subject.semesterId === formData.semesterId,
  );

  const filteredQuiz = quizzes.filter(
    (quiz) => quiz.subjectId === formData.subjectId,
  );

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg p-6 rounded">
      <h1 className="text-2xl font-bold mb-5 text-center">Add Quiz Question</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="semesterId"
          value={formData.semesterId}
          onChange={handleChange}
          className="w-full border p-2"
        >
          <option value="">Select Semester</option>

          {semesters.map((sem) => (
            <option key={sem.semesterId} value={sem.semesterId}>
              Semester {sem.semesterNumber}
            </option>
          ))}
        </select>

        <select
          name="subjectId"
          value={formData.subjectId}
          onChange={handleChange}
          className="w-full border p-2"
        >
          <option value="">Select Subject</option>

          {filteredSubjects.map((sub) => (
            <option key={sub.subjectId} value={sub.subjectId}>
              {sub.subjectName}
            </option>
          ))}
        </select>

        <select
          name="quizId"
          value={formData.quizId}
          onChange={handleChange}
          className="w-full border p-2"
        >
          <option value="">Select Quiz</option>

          {filteredQuiz.map((q) => (
            <option key={q.quizId} value={q.quizId}>
              {q.title}
            </option>
          ))}
        </select>

        <textarea
          name="question"
          value={formData.question}
          onChange={handleChange}
          placeholder="Enter Question"
          className="w-full border p-2"
        />

        <input
          type="file"
          name="quizquesFile"
          accept="image/*"
          onChange={handleChange}
          className="w-full border p-2"
        />

        {filePreview && (
          <div>
            <p className="font-semibold">Image Preview</p>

            <img
              src={filePreview}
              alt="preview"
              className="w-full h-64 object-contain border rounded"
            />
          </div>
        )}

        <input
          name="optionA"
          value={formData.optionA}
          onChange={handleChange}
          placeholder="Option A"
          className="w-full border p-2"
        />

        <input
          name="optionB"
          value={formData.optionB}
          onChange={handleChange}
          placeholder="Option B"
          className="w-full border p-2"
        />

        <input
          name="optionC"
          value={formData.optionC}
          onChange={handleChange}
          placeholder="Option C"
          className="w-full border p-2"
        />

        <input
          name="answer"
          value={formData.answer}
          onChange={handleChange}
          placeholder="Correct Answer"
          className="w-full border p-2"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Create Question
        </button>
      </form>
    </div>
  );
};

export default AddQuizQuestion;
