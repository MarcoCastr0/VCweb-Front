/**
 * About page component that displays information about the VCweb project,
 * including its academic purpose, description, and team members.
 *
 * @component
 * @returns {JSX.Element} The rendered About page.
 */

import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Sobre Nosotros" showMenu={true} />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Bienvenido a VCweb
          </h2>

          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Proyecto Académico
            </h3>

            <div className="space-y-6 text-gray-700">
              <p className="text-center leading-relaxed">
                VCweb es un proyecto desarrollado por estudiantes de la Universidad del 
                Valle - Sede Yumbo, como parte del curso de Proyecto Integrador 1.
              </p>

              <p className="text-center leading-relaxed">
                Este proyecto representa la integración de conocimientos adquiridos, 
                aplicando tecnologías modernas para crear una solución innovadora.
              </p>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 text-center mb-4">
                  Nuestro grupo está conformado por:
                </h4>

                <ul className="space-y-2 text-center">
                  <li className="text-gray-700">• Marco Fidel Castro Velasco</li>
                  <li className="text-gray-700">• Germán Enrique Franco Valencia</li>
                  <li className="text-gray-700">• Brayan Steven Fernández</li>
                  <li className="text-gray-700">• María Alexandra Morales</li>
                  <li className="text-gray-700">• Benjamín Rizo Luna</li>
                </ul>
              </div>

              <p className="text-center leading-relaxed pt-6">
                Gracias por visitar nuestro proyecto y ser parte de este proceso de 
                aprendizaje y crecimiento. 🎓
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
