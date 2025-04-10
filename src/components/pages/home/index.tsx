'use client';

import { motion } from 'framer-motion';
import Hero from './Hero';
import Link from 'next/link';
import Features from './Features';
import Testimonials from './Testimonials';
import Faq from './Faq';
import Footer from './Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-200"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Taskflow
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="#features"
                className="text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-600 hover:text-gray-900"
              >
                Testimonials
              </Link>
              <Link href="#faq" className="text-gray-600 hover:text-gray-900">
                FAQ
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>
      <Hero />
      <Features />
      <Testimonials />
      <Faq />
      <Footer />
    </div>
  );
}
