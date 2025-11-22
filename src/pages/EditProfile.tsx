/**
 * EditProfile page component that allows users to update their personal data
 * and optionally change their Firebase authentication password.
 *
 * This component loads user data from the backend on mount, displays a form,
 * and updates both Firebase authentication (if password fields are filled)
 * and backend user data.
 *
 * @component
 * @returns {JSX.Element|null} The rendered Edit Profile page or null while loading.
 */

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import type { User, UpdateUserData } from "../services/User";

import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";

export default function EditProfile() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    age: "",
    email: "",
    currentPassword: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  /**
   * Splits a full name into first name and last name.
   *
   * @param {string} fullName - The complete name string.
   * @returns {{ firstName: string, lastName: string }} Parsed name data.
   */
  const separateName = (fullName: string) => {
    if (!fullName) return { firstName: "", lastName: "" };

    const nameParts = fullName.trim().split(/\s+/);

    if (nameParts.length === 1) return { firstName: nameParts[0], lastName: "" };
    if (nameParts.length === 2) return { firstName: nameParts[0], lastName: nameParts[1] };
    if (nameParts.length === 3)
      return { firstName: `${nameParts[0]} ${nameParts[1]}`, lastName: nameParts[2] };

    const half = Math.floor(nameParts.length / 2);
    return {
      firstName: nameParts.slice(0, half).join(" "),
      lastName: nameParts.slice(half).join(" ")
    };
  };

  /**
   * Loads current user data from AuthService and backend.
   *
   * Redirects to login if no user is authenticated.
   */
  const loadUserData = async () => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const userFromDB = await UserService.getUserById(currentUser.id);
      setUser(userFromDB);

      const { firstName, lastName } = separateName(userFromDB.name);

      setFormData(prev => ({
        ...prev,
        name: firstName,
        lastName,
        age: userFromDB.age ? String(userFromDB.age) : "",
        email: userFromDB.email
      }));
    } catch (error) {
      console.error("Error cargando usuario:", error);
    }
  };

  /**
   * Handles form submission:
   * - Reauthenticates and updates Firebase password (if provided).
   * - Updates backend user profile.
   *
   * @param {React.FormEvent} e - Form submit event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) throw new Error("Usuario no autenticado");

      if (formData.password.trim() !== "") {
        if (formData.currentPassword.trim() === "") {
          setMessage("❌ Debes ingresar tu contraseña actual");
          setLoading(false);
          return;
        }

        try {
          const credential = EmailAuthProvider.credential(
            user.email,
            formData.currentPassword
          );

          await reauthenticateWithCredential(currentUser, credential);
          await updatePassword(currentUser, formData.password);

          setMessage("🔑 Contraseña actualizada correctamente");
        } catch (err: any) {
          if (err.code === "auth/wrong-password") {
            setMessage("❌ La contraseña actual es incorrecta");
          } else {
            setMessage("❌ Error actualizando contraseña");
          }

          setLoading(false);
          return;
        }
      }

      const updates: UpdateUserData = {
        name: `${formData.name} ${formData.lastName}`.trim(),
        email: formData.email,
        age: formData.age
      };

      const updatedUser = await UserService.updateUser(user.id, updates);
      AuthService.saveUserToStorage(updatedUser);

      setMessage(prev =>
        prev.includes("🔑")
          ? prev + "\n✅ Perfil actualizado correctamente"
          : "✅ Perfil actualizado correctamente"
      );

      setTimeout(() => navigate("/profile"), 2000);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    }

    setLoading(false);
  };

  /**
   * Updates form state when input fields change.
   *
   * @param {string} field - The field being updated.
   * @param {string} value - New value for the field.
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Editar perfil de usuario" showMenu={true} />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">

            {message && (
              <div
                className={`mb-4 p-3 rounded-lg text-center ${
                  message.includes("✅") || message.includes("🔑")
                    ? "bg-green-100 text-green-700 border border-green-400"
                    : "bg-red-100 text-red-700 border border-red-400"
                }`}
              >
                {message}
              </div>
            )}

            <form className="space-y-5 text-gray-700" onSubmit={handleSubmit}>

              <div className="flex flex-col">
                <label className="font-semibold">Nombres:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-1 border rounded-lg px-3 py-2 w-full"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold">Apellidos:</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="mt-1 border rounded-lg px-3 py-2 w-full"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold">Edad:</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="mt-1 border rounded-lg px-3 py-2 w-full"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold">Correo:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1 border rounded-lg px-3 py-2 w-full"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col relative">
                <label className="font-semibold">Contraseña actual:</label>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  placeholder="Requerida para cambiar la contraseña"
                  className="mt-1 border rounded-lg px-3 py-2 w-full pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-10 text-gray-500"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex flex-col relative">
                <label className="font-semibold">Nueva contraseña (opcional):</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Dejar en blanco si no se cambia"
                  className="mt-1 border rounded-lg px-3 py-2 w-full pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button type="submit" className="btn w-full" disabled={loading}>
                {loading ? "Guardando..." : "💾 Guardar Cambios"}
              </button>

            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
