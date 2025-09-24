'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Zap, 
  Target, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock,
  ArrowRight,
  CheckCircle 
} from 'lucide-react';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI-First Workflows',
      description: 'Build production-ready AI workflows that actually ship products and generate revenue.',
      benefits: ['Automated lead generation', 'Content production', 'Customer support'],
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Zero→One Methodology',
      description: 'Our proven framework takes you from idea to profitable business in 6 weeks.',
      benefits: ['Validated business model', 'MVP development', 'First paying customers'],
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Founder Community',
      description: 'Connect with 20+ ambitious founders building the future of AI-powered businesses.',
      benefits: ['Weekly group calls', 'Slack community', 'Peer accountability'],
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Revenue Generation',
      description: 'Learn to monetize your AI skills through productized consulting and SaaS offerings.',
      benefits: ['Pricing strategies', 'Sales processes', 'Recurring revenue'],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Proven Track Record',
      description: 'Join founders who have collectively generated $2M+ using our methodologies.',
      benefits: ['Case studies', 'Success stories', 'Best practices'],
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Time-Efficient',
      description: 'Designed for busy founders. 6 hours/week commitment with maximum impact.',
      benefits: ['Structured curriculum', 'Action-oriented', 'Results-focused'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section ref={ref} id="features" className="py-24 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Why Z21 Works
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Everything you need to build and ship
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            A complete system designed for founders who want to transform AI potential 
            into profitable, production-ready businesses.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-200/60 hover:border-gray-300/60 transition-all duration-300 hover:shadow-lg h-full">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl text-accent mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Hover Arrow */}
                <div className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-4 h-4 text-accent" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="inline-flex items-center text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200">
            <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
            Ready to transform your AI potential?
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
