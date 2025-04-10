import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import hero from '@/public/hero.png';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-100 to-purple-100 py-16 md:py-48">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="md:text-left space-y-4 md:space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
            Taskflow: Streamline Your Projects Maximize Your Productivity.
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
            Effortlessly manage tasks, collaborate seamlessly, and achieve your
            goals with our intuitive project management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md"
            >
              <Link href="/signup">Get Started</Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-8 py-3 rounded-md border"
            >
              <Link href="/demo">Request a Demo</Link>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.3 }}
          className="md:w-1/2"
        >
          <Image
            src={hero}
            alt="Taskflow Dashboard"
            width={600}
            height={400}
            className="rounded-lg shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
