/**
 * Profile page component that loads the authenticated user's data,
 * displays personal information, and provides actions to edit or delete the account.
 *
 * This component:
 * - Fetches fresh user data from the database on mount.
 * - Falls back to local storage data if the database request fails.
 * - Splits Hispanic full names into first and last name segments.
 * - Redirects to login if there is no active session.
 *
 * @component
 * @returns {JSX.Element} The rendered Profile page.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import type { User } from "../services/User";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserFromDatabase();
  }, []);

  /**
   * Loads the authenticated user's data from the database.
   * Falls back to local storage data if fetching fails.
   * Redirects to login if no user is authenticated.
   */
  const loadUserFromDatabase = async () => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const userFromDB = await UserService.getUserById(currentUser.id);
      console.log("📊 Usuario desde BD:", userFromDB);

      setUser(userFromDB);
      AuthService.saveUserToStorage(userFromDB); // update localStorage with fresh data
    } catch (error: any) {
      console.error("Error cargando usuario:", error);
      setError("Error al cargar los datos del usuario");
      setUser(currentUser); // fallback
    } finally {
      setLoading(false);
    }
  };

  /**
   * Splits Hispanic-style full names into first and last name parts.
   *
   * @param {string} fullName - The user's complete name.
   * @returns {{ firstName: string, lastName: string }} Structured name data.
   */
  const separateHispanicName = (fullName: string) => {
    if (!fullName) return { firstName: "", lastName: "" };

    const nameParts = fullName.trim().split(/\s+/);

    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: "" };
    }

    if (nameParts.length === 2) {
      return { firstName: nameParts[0], lastName: nameParts[1] };
    }

    if (nameParts.length === 3) {
      return {
        firstName: `${nameParts[0]} ${nameParts[1]}`,
        lastName: nameParts[2],
      };
    }

    if (nameParts.length >= 4) {
      const half = Math.floor(nameParts.length / 2);
      return {
        firstName: nameParts.slice(0, half).join(" "),
        lastName: nameParts.slice(half).join(" "),
      };
    }

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    return { firstName, lastName };
  };

  /**
   * Redirects the user to the edit profile page.
   */
  const handleEdit = () => {
    navigate("/edit-profile");
  };

  /**
   * Deletes the user's account after confirmation.
   * Logs them out and redirects to login.
   */
  const handleDeleteAccount = async () => {
    if (
      !user ||
      !window.confirm(
        "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      await UserService.deleteUser(user.id);
      AuthService.logout();
      navigate("/login");
    } catch (error) {
      alert("Error al eliminar la cuenta");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header title="Perfil de usuario" showMenu={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Cargando datos del usuario...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header title="Perfil de usuario" showMenu={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-500">
            {error || "Usuario no encontrado"}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { firstName, lastName } = separateHispanicName(user.name);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Perfil de usuario" showMenu={true} />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Nombres:</span>
                <span>{firstName || "No especificado"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Apellidos:</span>
                <span>{lastName || "No especificado"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Edad:</span>
                <span>{user.age || "No especificado"}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold col-span-1">Correo:</span>
                <span className="col-span-2 break-words text-right">
                  {user.email}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Proveedor:</span>
                <span className="capitalize">{user.provider}</span>
              </div>
            </div>

            <hr className="my-6" />

            <div className="flex flex-col gap-4">
              <button type="button" className="btn" onClick={handleEdit}>
                ✏️ Editar Información
              </button>

              <button
                type="button"
                className="btn_primary"
                onClick={handleDeleteAccount}
              >
                🗑️ Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
