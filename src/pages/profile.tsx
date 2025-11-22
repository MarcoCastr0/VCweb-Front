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

  const loadUserFromDatabase = async () => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      // SIEMPRE CONSULTAR A LA BASE DE DATOS
      const userFromDB = await UserService.getUserById(currentUser.id);
      console.log("📊 Usuario desde BD:", userFromDB);
      setUser(userFromDB);
      
      // Actualizar localStorage con datos frescos
      AuthService.saveUserToStorage(userFromDB);
    } catch (error: any) {
      console.error("Error cargando usuario:", error);
      setError("Error al cargar los datos del usuario");
      // Fallback a datos de localStorage
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  };

  // Función MEJORADA para separar nombres y apellidos hispanos
  const separateHispanicName = (fullName: string) => {
    if (!fullName) return { firstName: "", lastName: "" };
    
    const nameParts = fullName.trim().split(/\s+/);
    
    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: "" };
    }
    
    if (nameParts.length === 2) {
      // "Marco Castro" -> Nombre: "Marco", Apellido: "Castro"
      return { firstName: nameParts[0], lastName: nameParts[1] };
    }
    
    // Para 3 o más partes
    if (nameParts.length === 3) {
      // "Juan Carlos Pérez" -> Nombres: "Juan Carlos", Apellidos: "Pérez"
      return { 
        firstName: `${nameParts[0]} ${nameParts[1]}`, 
        lastName: nameParts[2] 
      };
    }
    
    // Para 4 o más partes: "Marco Fidel Castro Velasco"
    // -> Nombres: "Marco Fidel", Apellidos: "Castro Velasco"
    if (nameParts.length >= 4) {
      const half = Math.floor(nameParts.length / 2);
      return {
        firstName: nameParts.slice(0, half).join(' '),
        lastName: nameParts.slice(half).join(' ')
      };
    }
    
    // Fallback
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    return { firstName, lastName };
  };

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleDeleteAccount = async () => {
    if (!user || !window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
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

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate("/login");
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
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
          <div className="text-center text-red-500">{error || "Usuario no encontrado"}</div>
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
            
            {/* Info */}
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

              <div className="flex justify-between">
                <span className="font-semibold">Correo:</span>
                <span>{user.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Proveedor:</span>
                <span className="capitalize">{user.provider}</span>
              </div>
            </div>

            <hr className="my-6" />

            {/* Buttons */}
            <div className="flex flex-col gap-4">
              <button 
                type="button" 
                className="btn"
                onClick={handleEdit}
              >
                ✏️ Editar Información
              </button>

              <button 
                type="button" 
                className="btn bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleLogout}
              >
                🚪 Cerrar Sesión
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