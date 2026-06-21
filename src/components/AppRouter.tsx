import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import AdminLayout from "../pages/AdminLayout";
import AdminProtected from "../pages/AdminProtected";
import AddContent from "../pages/AddContent";
import AddNote from "../pages/AddNote";
import AddQuestion from "../pages/AddQuestion";
import AddQuiz from "../pages/AddQuiz";
import AddSemester from "../pages/AddSemester";
import AddSubContent from "../pages/AddSubContent";
import AddSubject from "../pages/AddSubject";
import AddQuizQUestion from "../pages/AddQuizQUestion";
import NoteManage from "../pages/NoteManage";
import ManageSubject from "../pages/ManageSubject";
import ManageContent from "../pages/ManageContent";
import ManageSubContent from "../pages/ManageSubContent";
import ManageQuiz from "../pages/ManageQuiz";
import ManageQuizQuestion from "../pages/ManageQuizQuestion";
import ManageLeaderBoard from "../pages/ManageLeaderBoard";
import ManageUser from "../pages/ManageUser";
import AddSyllabus from "../pages/AddSyllabus";
import ManageSyllabus from "../pages/ManageSyllabus";

const AppRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/access"
          element={
            <AdminProtected>
              <AdminLayout />
            </AdminProtected>
          }
        >
          <Route path="addcontent" element={<AddContent />} />
          <Route path="addnote" element={<AddNote />} />
          <Route path="addquestion" element={<AddQuestion />} />
          <Route path="addquiz" element={<AddQuiz />} />
          <Route path="addsemester" element={<AddSemester />} />
          <Route path="addsubcontent" element={<AddSubContent />} />
          <Route path="addsubject" element={<AddSubject />} />
          <Route path="quizquestion" element={<AddQuizQUestion/>} />
          <Route path="managenote" element={<NoteManage/>} />
          <Route path="managesubject" element={<ManageSubject/>} />
          <Route path="managecontent" element={<ManageContent/>} />
          <Route path="managesubcontent" element={<ManageSubContent/>} />
          <Route path="managequiz" element={<ManageQuiz/>} />
          <Route path="managequizques" element={<ManageQuizQuestion/>} />
          <Route path="manageleaderboard" element={<ManageLeaderBoard/>} />
          <Route path="manageuser" element={<ManageUser/>} />
          <Route path="addsyllabus" element={<AddSyllabus/>} />
          <Route path="managesyllabus" element={<ManageSyllabus/>} />
        </Route>
      </Routes>
    </div>
  );
};

export default AppRouter;
