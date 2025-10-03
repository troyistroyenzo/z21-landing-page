'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { QuoteIcon, ArrowUpIcon } from '@radix-ui/react-icons';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "AI Consultant",
      result: "$47K MRR in 4 months",
      quote: "I went from posting content daily with no results to having a waitlist of clients. The system just works.",
      metric: "+2,847%",
      metricLabel: "Revenue Growth"
    },
    {
      name: "Marcus Rodriguez",
      role: "Automation Expert",
      result: "12 enterprise clients",
      quote: "Stop chasing viral posts. Build systems that convert. This program showed me exactly how.",
      metric: "6-figure",
      metricLabel: "First Year"
    },
    {
      name: "Emma Watson",
      role: "Founder",
      result: "$8K/month recurring",
      quote: "I finally stopped being overwhelmed by AI tools and started using them to build a real business.",
      metric: "23 days",
      metricLabel: "To First Sale"
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            What Happens When You
            <span className="block text-tan">Build the Right System</span>
          </h2>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            These aren't just testimonials. Here's what happens when creators stop posting randomly 
            and start building strategically:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-emerald-900/30 backdrop-blur-sm rounded-xl p-6 border border-emerald-700/30 hover:border-tan/30 transition-all duration-300 h-full">
                <div className="mb-4">
                  <QuoteIcon className="w-8 h-8 text-tan/30" />
                </div>
                
                <p className="text-emerald-100 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                
                <div className="border-t border-emerald-700/30 pt-4">
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-tan mb-1">
                      {testimonial.metric}
                    </div>
                    <div className="text-sm text-emerald-400">
                      {testimonial.metricLabel}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-sm text-emerald-300">{testimonial.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-tan font-bold flex items-center">
                        <ArrowUpIcon className="w-4 h-4 mr-1" />
                        {testimonial.result}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
