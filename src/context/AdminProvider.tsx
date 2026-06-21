import { createContext, useEffect, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface Admin {
  userId: string;
  name: string;
  email: string;
  role: string;
}

interface AdminContextType {
  admin: Admin | null;
  setAdmin: Dispatch<SetStateAction<Admin | null>>;
  loading: boolean;
  error: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);


  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<boolean>(false);

  const getMe = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/user/getuser", {
        method: "GET",
        credentials: "include",
      });

      const user = await response.json();

      if (response.ok) {
        setAdmin(user.data);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      console.log("Error occurred at AdminProvider", error);

      setError(true);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        admin,
        setAdmin,
        loading,
        error,
        setLoading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
