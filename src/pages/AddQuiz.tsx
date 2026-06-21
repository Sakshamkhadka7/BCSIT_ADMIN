import { useEffect, useState, ChangeEvent, FormEvent } from "react";
const API=import.meta.env.VITE_API_URL


interface Subject {
  subjectId: number;
  subjectName: string;
  courseCode: string;
  semesterId:string
}

interface Semester {
  semesterId: string;
  semesterNumber: number;
}

interface QuizForm {
  title: string;
  totalMarks: string;
  duration: string;
  subjectId: string;
  semesterId:""
}

const AddQuiz = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters,setSemesters]=useState<Semester[]>([])

  const [formData, setFormData] = useState<QuizForm>({
    title: "",
    totalMarks: "",
    duration: "",
    subjectId: "",
    semesterId:""
  });

  // Fetch subjects
  const getSubjects = async () => {
    try {
      const response = await fetch(
        `${API}/sub/getsubject`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSubjects(result.data || []);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch subjects");
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
    getSemester()
  }, []);

  
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create quiz
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API}/quiz/createquiz`,
        {
          method: "POST",
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

        setFormData({
          title: "",
          totalMarks: "",
          duration: "",
          subjectId: "",
          semesterId:""
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const filteredSubjects=subjects.filter(
    (s)=> s.semesterId === formData.semesterId
  )

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 shadow-lg rounded bg-white">
      <h1 className="text-2xl font-bold mb-5 text-center">
        Add Quiz
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">


        <select
          name="semesterId"
          value={formData.semesterId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Semester</option>

          {semesters.map((semester) => (
            <option
              key={semester.semesterId}
              value={semester.semesterId}
            >
             Semester - {semester.semesterNumber} 
            </option>
          ))}
        </select>

        <select
          name="subjectId"
          value={formData.subjectId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Subject</option>

          {filteredSubjects.map((subject) => (
            <option
              key={subject.subjectId}
              value={subject.subjectId}
            >
              {subject.subjectName} ({subject.courseCode})
            </option>
          ))}
        </select>



        <input
          type="text"
          name="title"
          placeholder="Quiz title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="totalMarks"
          placeholder="Total Marks"
          value={formData.totalMarks}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

       

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default AddQuiz;