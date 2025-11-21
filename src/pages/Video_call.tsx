import Header from "../components/Header";
import Footer from "../components/Footer";
import { MicOff, VideoOff, PhoneOff, User } from "lucide-react";

export default function VideoCall() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <Header title="Llamada en vivo" showMenu={true} />

      {/* MAIN */}
      <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-10 px-6 py-10">

        {/* VIDEO BOX */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col items-center justify-between"
             style={{ height: "390px" }}>
          
          {/* USER ICON */}
          <div className="flex-1 flex items-center justify-center">
            <User size={120} className="text-gray-400" />
          </div>

          {/* CALL CONTROLS */}
          <div className="flex items-center gap-8 pb-2">
            <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition">
              <MicOff size={28} className="text-black" />
            </button>

            <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition">
              <VideoOff size={28} className="text-black" />
            </button>

            <button className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition">
              <PhoneOff size={28} className="text-white" />
            </button>
          </div>
        </div>

        {/* CHAT BOX */}
        <div className="w-full max-w-xs bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col"
             style={{ height: "390px" }}>
          
          {/* CHAT HEADER */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700">Chat en vivo</h3>
            <span className="cursor-pointer text-gray-500 text-lg">×</span>
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 border rounded-lg bg-gray-50 p-2 overflow-y-auto"></div>

          {/* INPUT */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Envia un mensaje"
              className="flex-1 border px-3 py-2 rounded-lg focus:outline-none"
            />
            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              ➤
            </button>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
