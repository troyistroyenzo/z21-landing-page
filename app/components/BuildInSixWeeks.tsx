'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RocketIcon, CodeIcon, TargetIcon, LayersIcon, DashboardIcon, CheckCircledIcon } from '@radix-ui/react-icons';

const BuildInSixWeeks = () => {
  const weeks = [
    {
      week: 1,
      icon: <RocketIcon className="w-6 h-6" />,
      title: "Foundation & Setup",
      description: "Install your first AI workflow and map your offer"
    },
    {
      week: 2,
      icon: <CodeIcon className="w-6 h-6" />,
      title: "Production Systems",
      description: "Build workflows that run without you"
    },
    {
      week: 3,
      icon: <TargetIcon className="w-6 h-6" />,
      title: "Offer Creation",
      description: "Design and price your flagship offer"
    },
    {
      week: 4,
      icon: <LayersIcon className="w-6 h-6" />,
      title: "VSL & Sales Page",
      description: "Create your 90-second VSL and launch page"
    },
    {
      week: 5,
      icon: <DashboardIcon className="w-6 h-6" />,
      title: "Traffic & Testing",
      description: "Drive targeted traffic and optimize conversions"
    },
    {
      week: 6,
      icon: <CheckCircledIcon className="w-6 h-6" />,
      title: "Scale & Automate",
      description: "Book calls and scale your validated offer"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            What You'll Build in <span className="text-green-600">6 Weeks</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This isn't just theory. Over 6 weeks, we'll install each piece of your business systematically.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeks.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-4">
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-gray-400">WEEK {item.week}</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuildInSixWeeks;
