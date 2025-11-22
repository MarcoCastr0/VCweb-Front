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

  // Estado para controlar el modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUserFromDatabase();
  }, []);

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
      AuthService.saveUserToStorage(userFromDB);
    } catch (error: any) {
      console.error("Error cargando usuario:", error);
      setError("Error al cargar los datos del usuario");
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  };

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

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  // 🔥 NUEVO: confirmación mediante modal
  const handleDeleteAccount = async () => {
    if (!user) return;

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
                onClick={() => setShowModal(true)}
              >
                🗑️ Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-3 text-center">
              Confirmar eliminación
            </h2>

            <p className="text-gray-700 text-center mb-6">
              ¿Seguro que deseas eliminar tu cuenta? <br />
              <strong>Esta acción no se puede deshacer.</strong>
            </p>

            <div className="flex justify-between gap-3">
              <button
                className="flex-1 py-2 bg-gray-300 text-black rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>

              <button
                className="flex-1 py-2 bg-red-600 text-white rounded-lg"
                onClick={handleDeleteAccount}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
