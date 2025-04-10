import { motion } from 'framer-motion';

export default function Faq() {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: 'How does Taskflow help with project management?',
              answer:
                'Taskflow provides a comprehensive suite of tools for project planning, task assignment, progress tracking, and team collaboration, all in one intuitive platform.',
            },
            {
              question: 'Is Taskflow suitable for remote teams?',
              answer:
                'Absolutely! Taskflow is designed with remote teams in mind, offering real-time collaboration features, cloud-based access, and seamless communication tools.',
            },
            {
              question: 'Can I try Taskflow before committing?',
              answer:
                'Yes, we offer a free trial period where you can explore all features. You can also request a personalized demo to see how Taskflow can work for your team.',
            },
            {
              question: 'What kind of support do you offer?',
              answer:
                'We provide 24/7 customer support, comprehensive documentation, and regular training sessions to ensure you get the most out of Taskflow.',
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl"
            >
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
