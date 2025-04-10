import { motion } from 'framer-motion';

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Powerful Features for Better Project Management
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Project Overview Dashboard',
              description:
                'Get a comprehensive view of all your projects and tasks in one place.',
              icon: '📊',
            },
            {
              title: 'Task Creation & Assignment',
              description:
                'Easily create and assign tasks to team members with clear deadlines.',
              icon: '✅',
            },
            {
              title: 'Deadline Tracking',
              description:
                'Never miss a deadline with automated reminders and milestone tracking.',
              icon: '⏰',
            },
            {
              title: 'Team Collaboration',
              description:
                'Seamless communication and file sharing within your team.',
              icon: '👥',
            },
            {
              title: 'Task Prioritization',
              description:
                'Efficiently manage priorities and focus on what matters most.',
              icon: '🎯',
            },
            {
              title: 'Progress Monitoring',
              description:
                'Track project progress and team performance in real-time.',
              icon: '📈',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className="text-4xl mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
