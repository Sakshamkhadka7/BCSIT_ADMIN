import { useEffect, useState } from "react";

const API=import.meta.env.VITE_API_URL


interface Subject {
  subjectId: string;
  subjectName: string;
  semesterId: string;
}

interface Semester {
  semesterId: string;
  semesterNumber: number;
}

const AddSyllabus = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    syllabusName: "",
    subjectId: "",
    semesterId: "",
    creditHours: "",
    unit: "",
    syllabus: null as File | null,
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

  useEffect(() => {
    getSemester();
    getSubjects();
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
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      syllabus: file,
    }));

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.syllabusName ||
      !formData.subjectId ||
      !formData.creditHours ||
      !formData.unit ||
      !formData.syllabus
    ) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();

      payload.append("syllabusName", formData.syllabusName);

      payload.append("subjectId", formData.subjectId);

      payload.append("creditHours", formData.creditHours);

      payload.append("unit", formData.unit);

      payload.append("syllabus", formData.syllabus);

      const res = await fetch(
        `${API}/syllabus/createsyllabus`,
        {
          method: "POST",
          credentials: "include",
          body: payload,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Syllabus created");

      setFormData({
        syllabusName: "",
        subjectId: "",
        semesterId: "",
        creditHours: "",
        unit: "",
        syllabus: null,
      });

      setPreview(null);
    } catch (error) {
      console.log(error);
      alert("Something went wrong . ");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = subjects.filter(
    (s) => s.semesterId === formData.semesterId,
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex justify-center">
      <div className="bg-white w-full max-w-xl p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Add Syllabus</h1>

        <form onSubmit={submitHandler} className="space-y-4">
          <select
            name="semesterId"
            value={formData.semesterId}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option value="">Select Semester</option>

            {semesters.map((s) => (
              <option key={s.semesterId} value={s.semesterId}>
                Semester {s.semesterNumber}
              </option>
            ))}
          </select>

          <select
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option value="">Select Subject</option>

            {filteredSubjects.map((s) => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectName}
              </option>
            ))}
          </select>

          <input
            name="syllabusName"
            placeholder="Syllabus Name"
            value={formData.syllabusName}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="number"
            name="creditHours"
            placeholder="Credit Hours"
            value={formData.creditHours}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="number"
            name="unit"
            placeholder="Total Units"
            value={formData.unit}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border p-3"
          />

          {preview && (
            <div>
              {formData.syllabus?.type.includes("pdf") ? (
                <iframe src={preview} className="w-full h-64" />
              ) : (
                <img src={preview} className="w-full h-64 object-cover" />
              )}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded"
          >
            {loading ? "Uploading..." : "Create Syllabus"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSyllabus;
