import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import logo from '../../assets/images/logo2.png';

const Footer = () => {
  return (
    <div className="bg-[#0a192f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img src={logo} alt="Medico Logo" className="w-[200px] h-[200px] mb-4" />
            <h3 className="text-xl font-bold mb-4">Medico</h3>
            <p className="text-gray-400">
              Your trusted partner in healthcare, connecting patients with
              qualified doctors and providing comprehensive medical services.
            </p>
          </div>

          {/* Quick Links 01 */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-gray-400 hover:text-white">
                  Find a Doctor
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links 02 */}
          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ambulances" className="text-gray-400 hover:text-white">
                  Find an Ambulance
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/Somzee5/Medico"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaGithub className="h-6 w-6" />
            </a>
            <a
              href="mailto:medicohelp2@gmail.com"
              className="text-gray-400 hover:text-white"
            >
              <FaEnvelope className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Medico. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
