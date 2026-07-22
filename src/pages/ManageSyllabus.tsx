import React, { useState , useEffect} from "react";
import type { ChangeEvent, FormEvent } from "react";


const API=import.meta.env.VITE_API_URL


interface Syllabus {
  syallabusId: string;
  syllabusName: string;
  syllabusFile: string;
  isDeleted: boolean;
}

const ManageSyllabus = () => {
  const [syllabus, setSyllabus] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    syllabusName: "",
    syllabus: null as File | null,
  });

  const getSyllabus = async () => {
    try {
      const response = await fetch(
        `${API}/syllabus/getsyllabus`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSyllabus(data.data || []);
      } else {
        setSyllabus([]);
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      setSyllabus([]);
    }
  };

  useEffect(() => {
    getSyllabus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "syllabus" && files) {
      setFormData((prev) => ({
        ...prev,
        syllabus: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEdit = (item: Syllabus) => {
    setEditingId(item.syallabusId);

    setFormData({
      syllabusName: item.syllabusName,
      syllabus: null,
    });
  };

  const updateSyllabus = async (e: FormEvent) => {
    e.preventDefault();

    if (!editingId) return;

    const payload = new FormData();

    payload.append("syllabusName", formData.syllabusName);

    if (formData.syllabus) {
      payload.append("syllabus", formData.syllabus);
    }

    const response = await fetch(
      `${API}/syllabus/updatesyllabus/${editingId}`,
      {
        method: "PUT",
        credentials: "include",
        body: payload,
      },
    );

    const data = await response.json();

    if (response.ok) {
      alert(data.message);

      setEditingId(null);

      setFormData({
        syllabusName: "",
        syllabus: null,
      });

      getSyllabus();
    } else {
      alert(data.message);
    }
  };

  const changeStatus = async (id: string, type: "block" | "unblock") => {
    const response = await fetch(
      `${API}/syllabus/${type}/${id}`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      getSyllabus();
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">Manage Syllabus</h1>

      {editingId && (
        <form
          onSubmit={updateSyllabus}
          className="border p-4 rounded mb-5 space-y-3"
        >
          <h2 className="font-bold">Update Syllabus</h2>

          <input
            name="syllabusName"
            value={formData.syllabusName}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Syllabus name"
          />

          <input
            type="file"
            name="syllabus"
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update
          </button>
        </form>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>

            <th className="border p-2">File</th>

            <th className="border p-2">Status</th>

            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {syllabus.length > 0 ? (
            syllabus.map((item) => (
              <tr key={item.syallabusId}>
                <td className="border p-2">{item.syllabusName}</td>

                <td className="border p-2">
                  <a
                    href={item.syllabusFile}
                    target="_blank"
                    className="text-blue-600"
                  >
                    View PDF
                  </a>
                </td>

                <td className="border p-2">
                  {item.isDeleted ? "Blocked" : "Active"}
                </td>

                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  {item.isDeleted ? (
                    <button
                      onClick={() => changeStatus(item.syallabusId, "unblock")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => changeStatus(item.syallabusId, "block")}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-5">
                No syllabus found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageSyllabus;
