'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ReaderIcon, VideoIcon, FileTextIcon, ChatBubbleIcon } from '@radix-ui/react-icons';

const CurriculumSection = () => {
  const modules = [
    {
      icon: <ReaderIcon className="w-5 h-5" />,
      title: "AI Foundations",
      topics: ["Prompt engineering", "Tool selection", "Workflow design"]
    },
    {
      icon: <VideoIcon className="w-5 h-5" />,
      title: "Content Systems",
      topics: ["VSL creation", "Copy frameworks", "Asset production"]
    },
    {
      icon: <FileTextIcon className="w-5 h-5" />,
      title: "Sales Architecture",
      topics: ["Offer design", "Pricing models", "Conversion optimization"]
    },
    {
      icon: <ChatBubbleIcon className="w-5 h-5" />,
      title: "Client Delivery",
      topics: ["Onboarding systems", "Support automation", "Retention strategies"]
    }
  ];

  return (
    <section className="py-24 bg-emerald-950">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-yellow-400/20 text-yellow-400 mb-6">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
            SELF-PACED LEARNING
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            TTB Foundational
            <span className="block text-yellow-400">Curriculum.</span>
          </h2>
          
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            When you join, you'll also unlock the TTB Foundational Curriculum, 
            which is a packed, foundational program you can work through at your own pace.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-emerald-900/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-700/30 hover:border-emerald-600/50 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center text-yellow-400 mr-4">
                  {module.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{module.title}</h3>
              </div>
              
              <ul className="space-y-2">
                {module.topics.map((topic, topicIndex) => (
                  <li key={topicIndex} className="flex items-center text-emerald-200">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                    {topic}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
