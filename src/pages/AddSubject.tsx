import { useEffect, useState } from "react";

interface Semester {
  semesterId: string;
  semesterNumber: number;
}

const AddSubject = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const [formData, setFormData] = useState({
    courseCode: "",
    subjectName: "",
    totalCredit: "",
    semesterId: "",
  });

  const getSemester = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/sem/getSemester",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.courseCode ||
      !formData.subjectName ||
      !formData.totalCredit ||
      !formData.semesterId
    ) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/sub/createsub", {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          courseCode: formData.courseCode,
          subjectName: formData.subjectName,
          totalCredit: Number(formData.totalCredit),
          semesterId: formData.semesterId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Subject created successfully");

      setFormData({
        courseCode: "",
        subjectName: "",
        totalCredit: "",
        semesterId: "",
      });
    } catch (error) {
      console.log("Error creating subject", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Add Subject</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-semibold">Semester</label>

            <select
              name="semesterId"
              value={formData.semesterId}
              onChange={handleChange}
              className="border rounded-lg w-full p-3"
            >
              <option value="">-- Choose Semester --</option>

              {semesters.map((semester) => (
                <option key={semester.semesterId} value={semester.semesterId}>
                  Semester {semester.semesterNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Course Code</label>

            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              className="border rounded-lg w-full p-3"
              placeholder="Enter course code"
            />
          </div>

          <div>
            <label className="font-semibold">Subject Name</label>

            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
              className="border rounded-lg w-full p-3"
              placeholder="Enter subject name"
            />
          </div>

          <div>
            <label className="font-semibold">Total Credit</label>

            <input
              type="number"
              name="totalCredit"
              value={formData.totalCredit}
              onChange={handleChange}
              className="border rounded-lg w-full p-3"
              placeholder="Enter credit"
            />
          </div>

          <button
            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            rounded-lg
            py-3
            font-semibold
            "
          >
            Create Subject
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubject;
