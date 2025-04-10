import { motion } from 'framer-motion';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center mb-12"
        >
          What Our Users Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              quote:
                'Taskflow has transformed how our team manages projects. The intuitive interface and powerful features have significantly improved our productivity.',
              author: 'Sarah Johnson',
              role: 'Project Manager, TechCorp',
            },
            {
              quote:
                'As a startup founder, Taskflow has been instrumental in keeping our team aligned and focused on our goals. The dashboard gives us perfect visibility into our progress.',
              author: 'Michael Chen',
              role: 'Founder, StartupX',
            },
            {
              quote:
                "The collaboration features in Taskflow have made remote work seamless for our team. We're more productive than ever before.",
              author: 'Emily Rodriguez',
              role: 'Team Lead, RemoteFirst',
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-xl"
            >
              <p className="text-gray-600 mb-4">{testimonial.quote}</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-gray-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
