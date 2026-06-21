import { useEffect, useState } from "react";

interface Subject {
  subjectId: string;
  subjectName: string;
  courseCode: string;
  semesterId:string
}

interface Semester{
  semesterNumber:number,
  semesterId:string
}

const AddContent = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semester,setSemester]=useState<Semester[]>([])

  const [formData, setFormData] = useState({
    chapterNumber: "",
    chapterName: "",
    subjectId: "",
    semesterId:"",
  });

  const [loading, setLoading] = useState(false);

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

  const getSemester=async()=>{
   
     try {
      const response=await fetch("http://localhost:3000/api/sem/getSemester",{
        method:"GET",
        credentials:"include"
      })
   
      const data= await response.json();
      if(!response){
        alert("get semester not fetched")
        return
      }

       setSemester(data.data || [])


     } catch (error) {
        console.log("Error occured at getSemester",error);
     }

  }

  useEffect(() => {
    getSubjects();
    getSemester()
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
      !formData.chapterNumber ||
      !formData.chapterName ||
      !formData.subjectId
    ) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/content/createcontent",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            chapterNumber: Number(formData.chapterNumber),
            chapterName: formData.chapterName,
            subjectId: formData.subjectId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Content created successfully");

      setFormData({
        chapterNumber: "",
        chapterName: "",
        subjectId: "",
        semesterId:""
      });
    } catch (error) {
      console.log("Create content error", error);
    } finally {
      setLoading(false);
    }
  };


  const filteredContents=subjects.filter(
    (s) => s.semesterId === formData.semesterId
  )

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
        <h1 className="text-2xl font-bold mb-6">Add Content</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
         
         
          <div>
            <label className="font-semibold">Select Semester</label>

            <select
              name="semesterId"
              value={formData.semesterId}
              onChange={handleChange}
              className="
              w-full
              border
              rounded-lg
              p-3
              mt-2
              "
            >
              <option value="">-- Select Semester --</option>

              {semester.map((semester) => (
                <option key={semester.semesterId} value={semester.semesterId}>
                 Semester {semester.semesterNumber}  
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Select Subject</label>

            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="
              w-full
              border
              rounded-lg
              p-3
              mt-2
              "
            >
              <option value="">-- Select Subject --</option>

              {filteredContents.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.courseCode} - {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Chapter Number</label>

            <input
              type="number"
              name="chapterNumber"
              value={formData.chapterNumber}
              onChange={handleChange}
              className="
              w-full
              border
              rounded-lg
              p-3
              mt-2
              "
              placeholder="Enter chapter number"
            />
          </div>

          <div>
            <label className="font-semibold">Chapter Name</label>

            <input
              type="text"
              name="chapterName"
              value={formData.chapterName}
              onChange={handleChange}
              className="
              w-full
              border
              rounded-lg
              p-3
              mt-2
              "
              placeholder="Enter chapter name"
            />
          </div>

          <button
            disabled={loading}
            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-blue-300
            text-white
            py-3
            rounded-lg
            font-semibold
            "
          >
            {loading ? "Creating..." : "Create Content"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContent;
