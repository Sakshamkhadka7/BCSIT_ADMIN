import { useEffect, useState } from "react";
const API=import.meta.env.VITE_API_URL


interface User {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  college: string;
  isDeleted: boolean;
}

const ManageUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllUser = async () => {
    try {
      const response = await fetch(
        `${API}/user/getalluser`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      setUsers(result.data || []);
    } catch (error) {
      console.log(error);

      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const blockUser = async (id: string) => {
    const response = await fetch(`${API}/user/block/${id}`, {
      method: "POST",
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);

      getAllUser();
    } else {
      alert(result.message);
    }
  };

  const unBlockUser = async (id: string) => {
    const response = await fetch(
      `${API}/user/unblock/${id}`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    const result = await response.json();

    if (response.ok) {
      alert(result.message);

      getAllUser();
    } else {
      alert(result.message);
    }
  };

  if (loading) {
    return <div className="p-5">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">Manage Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Name</th>

              <th className="border p-2">Email</th>

              <th className="border p-2">Phone</th>

              <th className="border p-2">College</th>

              <th className="border p-2">Status</th>

              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td className="border p-2">{user.name}</td>

                <td className="border p-2">{user.email}</td>

                <td className="border p-2">{user.phoneNumber}</td>

                <td className="border p-2">{user.college}</td>

                <td className="border p-2">
                  {user.isDeleted ? (
                    <span className="text-red-600">Blocked</span>
                  ) : (
                    <span className="text-green-600">Active</span>
                  )}
                </td>

                <td className="border p-2">
                  {user.isDeleted ? (
                    <button
                      onClick={() => unBlockUser(user.userId)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => blockUser(user.userId)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUser;
