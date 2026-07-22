import  { useState,useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";

const API=import.meta.env.VITE_API_URL


interface Content {
  contentId: number;
  chapterNumber: string;
  chapterName: string;
  subjectId: number;
  Subject:{
    subjectName:string
  }
}

const ManageContent = () => {
  const [contents, setContents] = useState<Content[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    chapterNumber: "",
    chapterName: "",
    subjectId: "",
  });
  const getContents = async () => {
    try {
      const response = await fetch(
        `${API}/content/getcontent`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (response.ok) {
        setContents(result.data || []);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch content");
    }
  };

  useEffect(() => {
    getContents();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (content: Content) => {
    setEditingId(content.contentId);

    setFormData({
      chapterNumber: content.chapterNumber,
      chapterName: content.chapterName,
      subjectId: String(content.subjectId),
    });
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingId) return;

    try {
      const response = await fetch(
        `${API}/content/updatecontent/${editingId}`,
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
          chapterNumber: "",
          chapterName: "",
          subjectId: "",
        });

        getContents();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this content?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API}/content/block/${id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        getContents();
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
      <h1 className="text-2xl font-bold mb-5">Manage Content</h1>

      {editingId && (
        <form
          onSubmit={handleUpdate}
          className="border p-4 rounded mb-5 space-y-3"
        >
          <h2 className="text-lg font-semibold">Edit Content</h2>

          <input
            type="text"
            name="chapterNumber"
            value={formData.chapterNumber}
            onChange={handleChange}
            placeholder="Chapter Number"
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="text"
            name="chapterName"
            value={formData.chapterName}
            onChange={handleChange}
            placeholder="Chapter Name"
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            placeholder="Subject ID"
            className="w-full border p-2 rounded"
            required
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Content
          </button>
        </form>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Chapter Number</th>
            <th className="border p-2">Chapter Name</th>
            <th className="border p-2">Subject Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {contents.map((content) => (
            <tr key={content.contentId}>
              <td className="border p-2">{content.chapterNumber}</td>

              <td className="border p-2">{content.chapterName}</td>

              <td className="border p-2">{content.Subject.subjectName}</td>

              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(content)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(content.contentId)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {contents.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No Content Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageContent;
