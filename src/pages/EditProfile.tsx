import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function EditProfile() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header title="Editar perfil de usuario" showMenu={true} />

      {/* Contenido */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">

            {/* Formulario */}
            <form className="space-y-5 text-gray-700">

              {/* Nombres */}
              <div className="flex flex-col">
                <label className="font-semibold">Nombres:</label>
                <input
                  type="text"
                  placeholder="Juan Carlos"
                  className="mt-1 border rounded-lg px-3 py-2 w-full focus:outline-none"
                />
              </div>

              {/* Apellidos */}
              <div className="flex flex-col">
                <label className="font-semibold">Apellidos:</label>
                <input
                  type="text"
                  placeholder="Morales"
                  className="mt-1 border rounded-lg px-3 py-2 w-full focus:outline-none"
                />
              </div>

              {/* Edad */}
              <div className="flex flex-col">
                <label className="font-semibold">Edad:</label>
                <input
                  type="number"
                  placeholder="25"
                  className="mt-1 border rounded-lg px-3 py-2 w-full focus:outline-none"
                />
              </div>

              {/* Correo */}
              <div className="flex flex-col">
                <label className="font-semibold">Correo:</label>
                <input
                  type="email"
                  placeholder="Juan@ejemplo.com"
                  className="mt-1 border rounded-lg px-3 py-2 w-full focus:outline-none"
                />
              </div>

              {/* Contraseña */}
              <div className="flex flex-col relative">
                <label className="font-semibold">Contraseña:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Juan1902*"
                  className="mt-1 border rounded-lg px-3 py-2 w-full focus:outline-none pr-10"
                />

                {/* Botón para mostrar/ocultar contraseña */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <hr className="my-4" />

              {/* Botón Guardar */}
              <button className="btn">💾 Guardar Cambios</button>
             
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
