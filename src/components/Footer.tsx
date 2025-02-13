import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              ActionS Team
            </h3>
            <p className="text-gray-600">
              Plataforma de formación integral que potencia a los asociados de Super Patch en liderazgo, finanzas, oratoria y persuasión.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cursos" className="text-gray-600 hover:text-red-600 transition-colors">
                  Cursos
                </Link>
              </li>
              <li>
                <Link to="/precios" className="text-gray-600 hover:text-red-600 transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link to="/instructor/juan-gallego" className="text-gray-600 hover:text-red-600 transition-colors">
                  Instructor
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-red-600 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-red-600 transition-colors">
                  Documentación
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-red-600 transition-colors">
                  Comunidad
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-red-600 transition-colors hover:scale-110 transform">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-600 transition-colors hover:scale-110 transform">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-600 transition-colors hover:scale-110 transform">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-600 transition-colors hover:scale-110 transform">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} ActionS Team. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};