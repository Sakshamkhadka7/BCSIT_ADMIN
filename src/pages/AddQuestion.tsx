import { useEffect, useState } from "react";
const API=import.meta.env.VITE_API_URL


interface Subject {
  subjectId: string;
  subjectName: string;
  courseCode: string;
  semesterId:string
}
interface Semester {
  semesterId: string;
  semesterNumber: number;
}

const AddQuestion = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters,setSemesters]=useState<Semester[]>([]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    subjectQuestion: "",
    questionYear: "",
    subjectId: "",
    semesterId:"",
    questionFile: null as File | null,
  });

  const getSubjects = async () => {
    try {
      const response = await fetch(`${API}/sub/getsubject`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setSubjects(data.data || []);
    } catch (error) {
      console.log("Error fetching subjects", error);
    }
  };

   const getSemester = async () => {
    try {
      const response = await fetch(
        `${API}/sem/getSemester`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      setSemesters(data.data || []);
    } catch (error) {
      console.log("Error occurred while fetching semester", error);
    }
  };

  

  useEffect(() => {
    getSubjects();
    getSemester();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setFormData((prev) => ({
      ...prev,
      questionFile: file ?? null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.subjectQuestion ||
      !formData.questionYear ||
      !formData.subjectId ||
      !formData.questionFile
    ) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();

      payload.append("subjectQuestion", formData.subjectQuestion);

      payload.append("questionYear", formData.questionYear);

      payload.append("subjectId", formData.subjectId);

      payload.append("question", formData.questionFile);

      const response = await fetch(
        `${API}/question/addQuestion`,
        {
          method: "POST",

          credentials: "include",

          body: payload,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Question created successfully");

      setFormData({
        subjectQuestion: "",
        questionYear: "",
        subjectId: "",
        questionFile: null,
        semesterId:"",
      });
    } catch (error) {
      console.log("Create question error", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects=subjects.filter(
    (s)=> s.semesterId === formData.semesterId
  )

  return (
    <div
      className="
      min-h-screen
      bg-slate-100
      p-8
      flex
      justify-center
    "
    >
      <div
        className="
        bg-white
        shadow-xl
        rounded-xl
        p-8
        w-full
        max-w-xl
      "
      >
        <h1
          className="
          text-2xl
          font-bold
          mb-6
        "
        >
          Add Question
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
       <div>
            <label className="font-semibold">Select Semester</label>

            <select
              name="semesterId"
              value={formData.semesterId}
              onChange={handleChange}
              className="
              w-full
              border
              rounded-lg
              p-3
              mt-2
              "
            >
              <option value="">-- Select Semester --</option>

              {semesters.map((semesters) => (
                <option key={semesters.semesterId} value={semesters.semesterId}>
                   Semester - {semesters.semesterNumber}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label className="font-semibold">Select Subject</label>

            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="
              w-full
              border
              rounded-lg
              p-3
              mt-2
              "
            >
              <option value="">-- Select Subject --</option>

              {filteredSubjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.courseCode} - {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Question</label>

            <input
              type="text"
              name="subjectQuestion"
              value={formData.subjectQuestion}
              onChange={handleChange}
              placeholder="Enter question"
              className="
              w-full
              border
              rounded-lg
              p-3
              mt-2
              "
            />
          </div>

          <div>
            <label className="font-semibold">Question Year</label>

            <input
              type="number"
              name="questionYear"
              value={formData.questionYear}
              onChange={handleChange}
              placeholder="2026"
              className="
              w-full
              border
              rounded-lg
              p-3
              mt-2
              "
            />
          </div>

          <div>
            <label className="font-semibold">Upload Question File</label>

            <input
              type="file"
              onChange={handleFileChange}
              className="
              w-full
              border
              rounded-lg
              p-3
              mt-2
              "
            />
          </div>

          <button
            disabled={loading}
            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-blue-300
            text-white
            py-3
            rounded-lg
            font-semibold
            "
          >
            {loading ? "Uploading..." : "Create Question"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuestion;
