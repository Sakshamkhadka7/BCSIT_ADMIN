import { useEffect, useState } from "react";

interface Semester {
  semesterId: string;
  semesterNumber: number;
}

interface Subject {
  subjectId: string;
  subjectName: string;
  semesterId: string;
}

interface Content {
  contentId: string;
  chapterName: string;
  subjectId: string;
}

// interface SubContent {
//   subContentId: string;
//   topicName: string;
//   contentId: string;
// }

const AddNote = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  // const [subContents, setSubContents] = useState<SubContent[]>([]);
  const [filePreview,setFilePreview]=useState<string | null>(null)


  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    semesterId: "",
    subjectId: "",
    contentId: "",
    topic: "",
    subTopics: "",
    noteFile: null as File | null,
  });


  const getSemester = async () => {
    const res = await fetch("http://localhost:3000/api/sem/getSemester", {
      credentials: "include",
    });

    const data = await res.json();

    setSemesters(data.data || []);
  };


  const getSubjects = async () => {
    const res = await fetch("http://localhost:3000/api/sub/getsubject", {
      credentials: "include",
    });

    const data = await res.json();
    console.log("getSubject", data.data);

    setSubjects(data.data || []);
  };

  const getContents = async () => {
    const res = await fetch("http://localhost:3000/api/content/getcontent", {
      credentials: "include",
    });

    const data = await res.json();
    console.log("getContent", data.data);

    setContents(data.data || []);
  };


  // const getSubContents = async () => {
  //   const res = await fetch(
  //     "http://localhost:5001/api/subcontent/getsubcontent",
  //     {
  //       credentials: "include",
  //     },
  //   );

  //   const data = await res.json();
  //   console.log("getsubcontent", data.data);

  //   setSubContents(data.data);
  // };

  useEffect(() => {
    getSemester();
    getSubjects();
    getContents();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "semesterId") {
      setFormData((prev) => ({
        ...prev,
        semesterId: value,
        subjectId: "",
        contentId: "",
        subContentId: "",
      }));
    }

    if (name === "subjectId") {
      setFormData((prev) => ({
        ...prev,
        subjectId: value,
        contentId: "",
        subContentId: "",
      }));
    }

    if (name === "contentId") {
      setFormData((prev) => ({
        ...prev,
        contentId: value,
        subContentId: "",
      }));
    }
  };

 const handleFileChange = (
 e: React.ChangeEvent<HTMLInputElement>
) => {

 const file=e.target.files?.[0] || null;

 setFormData(prev=>({
   ...prev,
   noteFile:file
 }));

 if(file){
   const preview=URL.createObjectURL(file);
   setFilePreview(preview);
 }

};

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.topic ||
      !formData.subTopics ||
      !formData.noteFile
    ) {
      alert("All fields required");
      return;
    }

    const payload = new FormData();

    payload.append("topic", formData.topic);

    payload.append("subTopics", formData.subTopics);

    // payload.append("subContentId", formData.subContentId);
    payload.append("contentId",formData.contentId)

    payload.append("note", formData.noteFile);

    setLoading(true);

    const res = await fetch("http://localhost:3000/api/note/addnote", {
      method: "POST",
      credentials: "include",
      body: payload,
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Note created");

    setFormData({
      semesterId: "",
      subjectId: "",
      contentId: "",
      topic: "",
      subTopics: "",
      noteFile: null,
    });
    setFilePreview(null)
  };

  const filteredSubjects = subjects.filter(
    (s) => s.semesterId === formData.semesterId,
  );

  const filteredContents = contents.filter(
    (c) => c.subjectId === formData.subjectId,
  );

  // const filteredSubContents = subContents.filter(
  //   (s) => s.contentId === formData.contentId,
  // );

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-5">Add Note</h1>

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
            <option>Select Subject</option>

            {filteredSubjects.map((s) => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectName}
              </option>
            ))}
          </select>

          <select
            name="contentId"
            value={formData.contentId}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option>Select Content</option>

            {filteredContents.map((c) => (
              <option key={c.contentId} value={c.contentId}>
                {c.chapterName}
              </option>
            ))}
          </select>

          {/* <select
            name="subContentId"
            value={formData.subContentId}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option>Select SubContent</option>

            {filteredSubContents.map((s) => (
              <option key={s.subContentId} value={s.subContentId}>
                {s.topicName}
              </option>
            ))}
          </select> */}

          <input
            name="topic"
            placeholder="Topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <textarea
            name="subTopics"
            placeholder="Sub Topics"
            value={formData.subTopics}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          {
            filePreview && (
              <div>
                <p className="font-semibold">Image Preview</p>
                <img src={filePreview} alt="Preview" />
              </div>
            )
          }

          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border p-3"
          />

          <button
            disabled={loading}
            className="bg-blue-600 text-white w-full p-3 rounded"
          >
            {loading ? "Uploading..." : "Create Note"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
