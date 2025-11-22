import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import type { User, UpdateUserData } from "../services/User";

export default function EditProfile() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    age: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  // Función para separar nombres y apellidos
  const separateName = (fullName: string) => {
    if (!fullName) return { firstName: "", lastName: "" };
    
    const nameParts = fullName.split(' ');
    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: "" };
    }
    
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    return { firstName, lastName };
  };

  const loadUserData = async () => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      // CARGAR DATOS ACTUALES DESDE LA BD
      const userFromDB = await UserService.getUserById(currentUser.id);
      console.log("📊 Usuario cargado para editar:", userFromDB); // DEBUG
      setUser(userFromDB);
      
      // Separar nombre y apellido usando la misma lógica
      const { firstName, lastName } = separateName(userFromDB.name);
      
      setFormData({
        name: firstName,
        lastName: lastName,
        age: userFromDB.age || "",
        email: userFromDB.email,
        password: ""
      });
    } catch (error) {
      console.error("Error cargando datos del usuario:", error);
      // Fallback a localStorage
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const { firstName, lastName } = separateName(currentUser.name);
        setFormData({
          name: firstName,
          lastName: lastName,
          age: currentUser.age || "",
          email: currentUser.email,
          password: ""
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const updates: UpdateUserData = {
        name: `${formData.name} ${formData.lastName}`.trim(),
        email: formData.email,
        age: formData.age
      };

      console.log("📤 Actualizando usuario:", updates);
      
      // ACTUALIZAR EN LA BASE DE DATOS
      const updatedUser = await UserService.updateUser(user.id, updates);
      
      // ACTUALIZAR LOCALSTORAGE CON RESPUESTA DEL BACKEND
      AuthService.saveUserToStorage(updatedUser);
      
      setMessage("✅ Perfil actualizado correctamente");
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
      
    } catch (error: any) {
      console.error("❌ Error actualizando perfil:", error);
      setMessage(`❌ Error: ${error.message || "No se pudo actualizar el perfil"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header title="Editar perfil de usuario" showMenu={true} />

      {/* Contenido */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">

            {/* Mensaje de estado */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-center ${
                message.includes('✅') 
                  ? 'bg-green-100 text-green-700 border border-green-400' 
                  : 'bg-red-100 text-red-700 border border-red-400'
              }`}>
                {message}
              </div>
            )}

            {/* Formulario */}
            <form className="space-y-5 text-gray-700" onSubmit={handleSubmit}>

              {/* Nombres */}
              <div className="flex flex-col">
                <label className="font-semibold">Nombres:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Juan Carlos"
                  className="mt-1 border rounded-lg px-3 py-2 w-full focus:outline-none"
                  disabled={loading}
                />
              </div>

              {/* Apellidos */}
              <div className="flex flex-col">
                <label className="font-semibold">Apellidos:</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Morales"
                  className="mt-1 border rounded-lg px-3 py-2 w-full focus:outline-none"
                  disabled={loading}
                />
              </div>

              {/* Edad */}
              <div className="flex flex-col">
                <label className="font-semibold">Edad:</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="25"
                  className="mt-1 border rounded-lg px-3 py-2 w-full focus:outline-none"
                  disabled={loading}
                />
              </div>

              {/* Correo */}
              <div className="flex flex-col">
                <label className="font-semibold">Correo:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Juan@ejemplo.com"
                  className="mt-1 border rounded-lg px-3 py-2 w-full focus:outline-none"
                  disabled={loading}
                />
              </div>

              {/* Contraseña */}
              <div className="flex flex-col relative">
                <label className="font-semibold">Nueva Contraseña (opcional):</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Dejar en blanco para no cambiar"
                  className="mt-1 border rounded-lg px-3 py-2 w-full focus:outline-none pr-10"
                  disabled={loading}
                />

                {/* Botón para mostrar/ocultar contraseña */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <hr className="my-4" />

              {/* Botón Guardar */}
              <button 
                type="submit" 
                className="btn w-full"
                disabled={loading}
              >
                {loading ? "Guardando..." : "💾 Guardar Cambios"}
              </button>
             
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}