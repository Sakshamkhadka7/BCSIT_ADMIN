import { useState } from "react";
const API=import.meta.env.VITE_API_URL



const AddSemester = () => {
  const [semesterNumber, setSemesterNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!semesterNumber.trim()) {
      setMessage({
        type: "error",
        text: "Semester number is required",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage({
        type: "",
        text: "",
      });

      const response = await fetch(`${API}/sem/createSem`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          semesterNumber: Number(semesterNumber),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.message || "Failed to create semester",
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Semester created successfully",
      });

      setSemesterNumber("");
    } catch (error) {
      console.log("Add semester error", error);

      setMessage({
        type: "error",
        text: "Something went wrong. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start p-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Add Semester</h1>

          <p className="text-sm text-slate-500 mt-2">
            Create a new semester for academic management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Semester Number
            </label>

            <input
              type="number"
              value={semesterNumber}
              onChange={(e) => setSemesterNumber(e.target.value)}
              placeholder="Enter semester number"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-200
              "
            />
          </div>

          {message.text && (
            <div
              className={`rounded-lg px-4 py-3 text-sm
                ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {message.text}
            </div>
          )}

          <button
            disabled={loading}
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-300
              text-white
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            {loading ? "Creating..." : "Create Semester"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSemester;
