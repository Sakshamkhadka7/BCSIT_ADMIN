import { FaStickyNote } from "react-icons/fa";
import { SiContentful } from "react-icons/si";
import { LuNewspaper } from "react-icons/lu";
import { MdQuiz } from "react-icons/md";
import { MdHotelClass } from "react-icons/md";
import { MdContentCut } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { MdOutlineLeaderboard } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";

const API=import.meta.env.VITE_API_URL


const AdminLayout = () => {
  const [sidebar, setSideBar] = useState(true);
  const navigate=useNavigate();

  const navItems = [
    {
      to: "/access/addnote",
      label: "Add Note",
      icon: FaStickyNote,
    },
    {
      to: "/access/addcontent",
      label: "Add Content",
      icon: SiContentful,
    },
    {
      to: "/access/addquestion",
      label: "Add Question",
      icon: LuNewspaper,
    },
    {
      to: "/access/addquiz",
      label: "Add Quiz",
      icon: MdQuiz,
    },
    {
      to: "/access/addsemester",
      label: "Add Semester",
      icon: MdHotelClass,
    },
    {
      to: "/access/addsubcontent",
      label: "Add SubContent",
      icon: MdContentCut,
    },
    {
      to: "/access/addsubject",
      label: "Add Subject",
      icon: FaBookOpen,
    },
    {
      to: "/access/quizquestion",
      label: "Add Quiz Question",
      icon: FaBookOpen,
    },
    {
      to: "/access/managenote",
      label: "Manage Note",
      icon: FaStickyNote,
    },
    {
      to: "/access/managesubject",
      label: "Manage Subject",
      icon: FaBookOpen,
    },
    {
      to: "/access/managecontent",
      label: "Manage Content",
      icon: MdContentCut,
    },
    {
      to: "/access/managesubcontent",
      label: "Manage SubContent",
      icon: MdContentCut,
    },
    {
      to: "/access/managequiz",
      label: "Manage Quiz",
      icon: MdQuiz,
    },
    {
      to: "/access/managequizques",
      label: "Manage Quiz Question",
      icon: MdQuiz,
    },
    {
      to: "/access/manageleaderboard",
      label: "Manage Leaderboard",
      icon: MdOutlineLeaderboard,
    },
    {
      to: "/access/manageuser",
      label: "Manage User",
      icon: FaUserCircle,
    },
    {
      to:"/access/addsyllabus",
      label:"Add Syllabus",
      icon:FaFilePdf
    },{
      to:"/access/managesyllabus",
      label:"Manage Syllabus",
      icon:FaFilePdf
    }
  ];

 const logout = async () => {
  try {
    const response = await fetch(
      `${API}/user/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );


    const result = await response.json();


    if (!response.ok) {
      alert(result.message || "Logout failed");
      return;
    }


    alert("Logout successful");


    navigate("/login");

  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-40
          w-72
          bg-slate-900
          text-white
          transform
          transition-transform
          duration-300
          flex
          flex-col

          ${sidebar ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div
          className="
          h-16
          flex
          items-center
          justify-between
          px-5
          border-b
          border-slate-700
          "
        >
          <h1>Admin Portal</h1>

          <button
            onClick={() => setSideBar(false)}
            className="
            text-slate-300
            hover:text-white
            "
          >
            <RxCross1 />
          </button>
        </div>

        <nav
          className="
          flex-1
          overflow-y-auto
          p-2
          space-y-1
          scrollbar-thin
          "
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              to={to}
              key={to}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                text-sm
                transition

                ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }

                `
              }
            >
              <Icon className="text-lg" />

              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div
        className={`
          flex-1
          transition-all
          duration-300

          ${sidebar ? "ml-72" : "ml-0"}

        `}
      >
        <header
          className="
          h-16
          sticky
          top-0
          z-30
          bg-white
          border-b
          border-slate-200
          flex
          items-center
          justify-between
          px-4
          md:px-6
          "
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSideBar(true)}
              className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              p-2
              hover:bg-slate-100
              "
            >
              <IoMenu />
            </button>

            <h2>Dashboard</h2>
          </div>

          <div
            className="
            border
            px-10
            py-1
            rounded-xl
            bg-blue-500
            text-white
            cursor-pointer
            "
            onClick={() => logout()}
          >
            Logout
          </div>
        </header>

        <main className="p-4 md:p-1">
          <div
            className="
            rounded-2xl
            bg-white
            shadow-sm
            border
            border-slate-200
            p-4
            md:p-3
            min-h-[calc(100vh-8rem)]
            "
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
