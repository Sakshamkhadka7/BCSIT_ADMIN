import { useEffect, useState, ChangeEvent, FormEvent } from "react";

const API=import.meta.env.VITE_API_URL


interface Subject {
  subjectId: number;
  courseCode: string;
  subjectName: string;
  totalCredit: number;
  semesterId: number;
  Semester: {
    semesterNumber: number;
  };
}

const ManageSubject = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    courseCode: "",
    subjectName: "",
    totalCredit: "",
    semesterId: "",
  });

  // Fetch all subjects
  const getSubjects = async () => {
    try {
      const response = await fetch(`${API}/sub/getsubject`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      console.log(result.data);

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

  useEffect(() => {
    getSubjects();
  }, []);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Open edit form
  const handleEdit = (subject: Subject) => {
    setEditingId(subject.subjectId);

    setFormData({
      courseCode: subject.courseCode,
      subjectName: subject.subjectName,
      totalCredit: String(subject.totalCredit),
      semesterId: String(subject.semesterId),
    });
  };

  // Update subject
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingId) return;

    try {
      const response = await fetch(
        `${API}/sub/updatesub/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);

        setEditingId(null);

        setFormData({
          courseCode: "",
          subjectName: "",
          totalCredit: "",
          semesterId: "",
        });

        getSubjects();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  // Soft delete (block)
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API}/sub/block/${id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        getSubjects();
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
      <h1 className="text-2xl font-bold mb-5">Manage Subjects</h1>

      {editingId && (
        <form
          onSubmit={handleUpdate}
          className="border p-4 rounded mb-5 space-y-3"
        >
          <h2 className="font-semibold text-lg">Edit Subject</h2>

          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            placeholder="Course Code"
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleChange}
            placeholder="Subject Name"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="totalCredit"
            value={formData.totalCredit}
            onChange={handleChange}
            placeholder="Total Credit"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="semesterId"
            value={formData.semesterId}
            onChange={handleChange}
            placeholder="Semester ID"
            className="w-full border p-2 rounded"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Subject
          </button>
        </form>
      )}

      {/* Subject Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Course Code</th>
            <th className="border p-2">Subject Name</th>
            <th className="border p-2">Credit</th>
            <th className="border p-2">Semester</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.subjectId}>
              <td className="border p-2">{subject.courseCode}</td>

              <td className="border p-2">{subject.subjectName}</td>

              <td className="border p-2">{subject.totalCredit}</td>

              <td className="border p-2">{subject.Semester.semesterNumber}</td>

              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(subject)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(subject.subjectId)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {subjects.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No Subjects Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageSubject;
