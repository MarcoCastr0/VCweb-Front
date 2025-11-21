import Header from "../components/Header";
import Footer from "../components/Footer";

const StartMeeting = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <Header title="Inicia una reunion" showMenu={true} />

      {/* MAIN CONTENT */}
      <main
        className="flex-1 w-full px-6 lg:px-16 py-6 flex flex-col lg:flex-row 
                 items-center justify-center gap-16"
      >
        {/* LEFT TEXT CONTENT */}
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

        {/* RIGHT CARD - JOIN / CREATE MEETING */}
        <section className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-200 p-6">
          {/* Title */}
          <h3 className="text-gray-800 font-semibold text-lg mb-4">
            Comienza Ahora
          </h3>

          {/* Input + Join button */}
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

          {/* Create meeting button */}
          <button type="submit" className="btn">✚ Nueva Reunión</button>
          

          <p className="text-center text-gray-500 text-sm mt-4">
            Crea o únete a una reunión en segundos
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default StartMeeting;
