// src/components/Footer.jsx (umumiy uday footer)
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin, Copyright } from 'lucide-react';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 text-white py-12 px-4"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Kompaniya bo'limi */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <Car className="w-6 h-6" />
              <span>AFOOMS</span>
            </h3>
            <p className="text-gray-300 mb-4">Avtomobil ishlab chiqarish va yetkazib berish jarayonlarini raqamlashtirish tizimi. Sifat va tezlik bilan.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Navigatsiya bo'limi */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Navigatsiya</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-blue-400 transition-colors">Dashboard</a></li>
              <li><a href="/orders" className="text-gray-300 hover:text-blue-400 transition-colors">Buyurtmalar</a></li>
              <li><a href="/warehouse" className="text-gray-300 hover:text-blue-400 transition-colors">Ombor</a></li>
              <li><a href="/reports" className="text-gray-300 hover:text-blue-400 transition-colors">Hisobotlar</a></li>
              <li><a href="/users" className="text-gray-300 hover:text-blue-400 transition-colors">Foydalanuvchilar</a></li>
            </ul>
          </motion.div>

          {/* Aloqa bo'limi */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Aloqa</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">+998 71 123 45 67</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">info@afoms.uz</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Toshkent sh., Chilonzor tumani, 1-uy</span>
              </div>
            </div>
          </motion.div>

          {/* Newsletter bo'limi */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Yangiliklar</h4>
            <p className="text-gray-300 mb-4">Yangiliklar va aksiyalardan xabardor bo'ling.</p>
            <div className="flex">
              <input type="email" placeholder="Emailingizni kiriting" className="flex-1 px-4 py-2 rounded-l-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-r-lg hover:shadow-lg transition-all duration-300">
                Obuna bo'lish
              </button>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 mt-8 text-center">
          <p className="text-gray-400">
            <Copyright className="w-4 h-4 inline mr-1" />
            2025 AFOOMS. Barcha huquqlar himoyalangan. |{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Maxfiylik siyosati</a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}