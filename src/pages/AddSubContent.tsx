import { useEffect, useState } from "react";

interface Content {
  contentId: string;
  chapterName: string;
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

const AddSubContent = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const [formData, setFormData] = useState({
    topicName: "",
    topicOrder: "",
    contentId: "",
    subjectId: "",
    semesterId: "",
  });

  const [loading, setLoading] = useState(false);

  const getSemester = async () => {
    const res = await fetch("http://localhost:3000/api/sem/getSemester", {
      credentials: "include",
    });

    const data = await res.json();

    setSemesters(data.data || []);
  };

  const getSubjects = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/sub/getsubject", {
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

  const getContents = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/content/getcontent",
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
      console.log(data.data);
      setContents(data.data || []);
    } catch (error) {
      console.log("Error fetching content", error);
    }
  };

  useEffect(() => {
    getContents();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.topicName || !formData.topicOrder || !formData.contentId) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/subcontent/createsubcontent",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topicName: formData.topicName,
            topicOrder: Number(formData.topicOrder),
            contentId: formData.contentId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Subcontent created successfully");

      setFormData({
        topicName: "",
        topicOrder: "",
        contentId: "",
        semesterId: "",
        subjectId: "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = subjects.filter(
    (s) => s.semesterId === formData.semesterId,
  );

  const filteredContents = contents.filter(
    (c) => c.subjectId === formData.subjectId,
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex justify-center">
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
        <h1 className="text-2xl font-bold mb-6">Add Semester</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-2">Select Semester</label>

            <select
              name="semesterId"
              value={formData.semesterId}
              onChange={handleChange}
              className="
              w-full
              h-12
              border
              border-gray-300
              rounded-lg
              px-3
              bg-white
              text-black
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            >
              <option value="">-- Select Semester --</option>

              {semesters.map((sem) => (
                <option
                  key={sem.semesterId}
                  value={sem.semesterId}
                  className="text-lg"
                >
                  Semester - {sem.semesterNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Select Subject</label>

            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="
              w-full
              h-12
              border
              border-gray-300
              rounded-lg
              px-3
              bg-white
              text-black
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            >
              <option value="">-- Select Subject --</option>

              {filteredSubjects.map((sub) => (
                <option
                  key={sub.subjectId}
                  value={sub.subjectId}
                  className="text-lg"
                >
                  {sub.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Select Content</label>

            <select
              name="contentId"
              value={formData.contentId}
              onChange={handleChange}
              className="
              w-full
              h-12
              border
              border-gray-300
              rounded-lg
              px-3
              bg-white
              text-black
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            >
              <option value="">-- Select Content --</option>

              {filteredContents.map((content) => (
                <option
                  key={content.contentId}
                  value={content.contentId}
                  className="text-lg"
                >
                  {content.chapterName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Topic Name</label>

            <input
              type="text"
              name="topicName"
              value={formData.topicName}
              onChange={handleChange}
              className="
              w-full
              border
              rounded-lg
              p-3
            "
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Topic Order</label>

            <input
              type="number"
              name="topicOrder"
              value={formData.topicOrder}
              onChange={handleChange}
              className="
              w-full
              border
              rounded-lg
              p-3
            "
            />
          </div>

          <button
            disabled={loading}
            className="
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-lg
            font-semibold
            hover:bg-blue-700
          "
          >
            {loading ? "Creating..." : "Create Sub Content"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubContent;
