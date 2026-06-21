import { useEffect, useState, ChangeEvent, FormEvent } from "react";

interface Note {
  noteId: number;
  topic: string;
  subTopics: string;
  noteFile: string;
}

const NoteManage = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    topic: "",
    subTopics: "",
    file: null as File | null,
  });

  // Fetch notes
  const getNotes = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/note/getNote",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();
       console.log(result.data);
      if (response.ok) {
        setNotes(result.data || []);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  // Input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, files } = e.target;

    if (name === "file" && files) {
      setFormData({
        ...formData,
        file: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Start editing
  const handleEdit = (note: Note) => {
    setEditingId(note.noteId);

    setFormData({
      topic: note.topic,
      subTopics: note.subTopics,
      file: null,
    });
  };

  // Update note
  const handleUpdate = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingId) return;

    try {
      const data = new FormData();

      data.append("topic", formData.topic);
      data.append("subTopics", formData.subTopics);

      if (formData.file) {
        data.append("note", formData.file);
      }

      const response = await fetch(
        `http://localhost:3000/api/note/updateNote/${editingId}`,
        {
          method: "PUT",
          credentials: "include",
          body: data,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);

        setEditingId(null);

        setFormData({
          topic: "",
          subTopics: "",
          file: null,
        });

        getNotes();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Soft delete note
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/note/block/${id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        getNotes();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">
        Manage Notes
      </h1>

      {/* Edit Form */}
      {editingId && (
        <form
          onSubmit={handleUpdate}
          className="border p-4 mb-5 rounded space-y-3"
        >
          <h2 className="font-bold text-lg">
            Edit Note
          </h2>

          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Topic"
            className="w-full border p-2"
          />

          <input
            type="text"
            name="subTopics"
            value={formData.subTopics}
            onChange={handleChange}
            placeholder="Sub Topics"
            className="w-full border p-2"
          />

          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="w-full"
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Note
          </button>
        </form>
      )}

      {/* Notes Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">
              Topic
            </th>
            <th className="border p-2">
              Sub Topics
            </th>
            <th className="border p-2">
              File
            </th>
            <th className="border p-2">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {notes.map((note) => (
            <tr key={note.noteId}>
              <td className="border p-2">
                {note.topic}
              </td>

              <td className="border p-2">
                {note.subTopics}
              </td>

              <td className="border p-2">
                <a
                  href={note.noteFile}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600"
                >
                  View File
                </a>
              </td>

              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(note.noteId)
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {notes.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="text-center p-4"
              >
                No Notes Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NoteManage;