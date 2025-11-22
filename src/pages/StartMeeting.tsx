import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * StartMeeting page component.
 * 
 * Provides UI for starting a new meeting or joining an existing one 
 * by entering a meeting code. It includes navigation, input handling, 
 * and layout for the meeting start section.
 * 
 * @component
 * @returns {JSX.Element} The rendered StartMeeting page.
 */
const StartMeeting = () => {
  const navigate = useNavigate();

  /**
   * Navigates the user to the video call page to start a new meeting.
   * 
   * @function
   * @returns {void}
   */
  const handleNewMeeting = () => {
    navigate("/video-call");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Inicia una reunion" showMenu={true} />

      <main
        className="flex-1 w-full px-6 lg:px-16 py-6 flex flex-col lg:flex-row 
                 items-center justify-center gap-16"
      >
        <section className="max-w-xl">
          <h1 className="text-4xl font-bold text-gray-900 leading-snug mb-4">
            Video conferencias seguras <br /> para tus proyectos digitales.
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed">
            Conéctate, colabora y <br />
            gestiona tus proyectos <br />
            fácilmente con VCweb.
          </p>
        </section>

        <section className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-gray-800 font-semibold text-lg mb-4">
            Comienza Ahora
          </h3>

          <div className="flex gap-3 mb-5">
            <input
              type="text"
              placeholder="Introduce un codigo"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#04A3EA]"
            />

            <button
              className="bg-[#04A3EA] text-white font-semibold px-5 rounded-lg
                         transition-all hover:bg-[#0087C5] shadow-sm"
            >
              Unirme
            </button>
          </div>

          <button 
            type="button" 
            className="btn"
            onClick={handleNewMeeting}
          >
            ✚ Nueva Reunión
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            Crea o únete a una reunión en segundos
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StartMeeting;
