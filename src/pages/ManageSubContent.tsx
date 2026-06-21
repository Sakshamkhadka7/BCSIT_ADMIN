import { useEffect, useState, ChangeEvent, FormEvent } from "react";

const API=import.meta.env.VITE_API_URL


interface SubContent {
  subContentId: number;
  topicName: string;
  topicOrder: number;
  contentId: number;
  Chapter:{
    chapterName:string
  }
}

const ManageSubContent = () => {
  const [subContents, setSubContents] = useState<SubContent[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    topicName: "",
    topicOrder: "",
  });

  // Get all subcontents
  const getSubContents = async () => {
    try {
      const response = await fetch(
        `${API}/subcontent/getsubcontent`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();
      console.log(result.data);

      if (response.ok) {
        setSubContents(result.data || []);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch sub contents");
    }
  };

  useEffect(() => {
    getSubContents();
  }, []);

  // Input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Open edit form
  const handleEdit = (sub: SubContent) => {
    setEditingId(sub.subContentId);

    setFormData({
      topicName: sub.topicName,
      topicOrder: String(sub.topicOrder),
    });
  };

  // Update
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingId) return;

    try {
      const response = await fetch(
        `${API}/subcontent/updatesubcontent/${editingId}`,
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
          topicName: "",
          topicOrder: "",
        });

        getSubContents();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  // Delete (block)
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sub content?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API}/subcontent/block/${id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        getSubContents();
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
        Manage Sub Content
      </h1>

      {editingId && (
        <form
          onSubmit={handleUpdate}
          className="border p-4 rounded mb-5 space-y-3"
        >
          <h2 className="font-semibold text-lg">
            Edit Sub Content
          </h2>

          <input
            type="text"
            name="topicName"
            value={formData.topicName}
            onChange={handleChange}
            placeholder="Topic Name"
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            name="topicOrder"
            value={formData.topicOrder}
            onChange={handleChange}
            placeholder="Topic Order"
            className="w-full border p-2 rounded"
            required
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Sub Content
          </button>
        </form>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">
              Topic Name
            </th>
            <th className="border p-2">
              Topic Order
            </th>
            <th className="border p-2">
              Content ID
            </th>
            <th className="border p-2">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {subContents.map((sub) => (
            <tr key={sub.subContentId}>
              <td className="border p-2">
                {sub.topicName}
              </td>

              <td className="border p-2">
                {sub.topicOrder}
              </td>

              <td className="border p-2">
                {sub.Chapter.chapterName}
              </td>

              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(sub)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(sub.subContentId)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {subContents.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No Sub Content Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageSubContent;