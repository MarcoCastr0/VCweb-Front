import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {" "}
      {/* Fondo azul del modelo */}
      <Header title="¿Olvidaste tu contraseña?" />
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full rounded-2xl p-8">
          {" "}
          {/* Caja blanca centrada */}
          {/* Título */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Restablece tu contraseña
            </h2>
            <p className="text-gray-700 text-sm">
              Ingresa tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña.
            </p>
          </div>
          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8FF]"
            />
          </div>
          {/* Botón */}
          <button className="btn">Enviar correo</button>
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              ¿Recordaste tu contraseña?{" "}
              <a href="#" className="text-[#00A8FF] font-semibold underline">
                Inicia sesión
              </a>
            </p>
          </div>
          {/* Tips de seguridad */}
          <div className="mt-4 border border-gray-400 bg-[#e6f3ff] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>💡</span> Consejos de seguridad:
            </h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• Revisa tu carpeta de spam si no recibes el correo</li>
              <li>• El enlace expirará en 24 horas por seguridad</li>
              <li>• Nunca compartas tu contraseña con nadie</li>
              <li>• Usa una contraseña única y segura</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
