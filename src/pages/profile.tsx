import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Profile() {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/edit-profile");
  };

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
                <span>Juan Carlos</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Apellidos:</span>
                <span>Morales</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Edad:</span>
                <span>30</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Correo:</span>
                <span>Juan@ejemplo.com</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Contraseña:</span>
                <span>**************</span>
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

              <button type="button" className="btn_primary">
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
