'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ClientsSection = () => {
  const clients = [
    {
      name: "Client Logo 1",
      logoUrl: "https://cdn.prod.website-files.com/682e5f308475223abbd39258/682e5f308475223abbd392b1_logo%2520(8)-p-500.png",
      alt: "Client 1 Logo"
    },
    {
      name: "GetFound",
      logoUrl: "https://www.getfound.id/wp-content/uploads/2024/07/getfound-logo1-1-1.webp",
      alt: "GetFound Logo"
    }
  ];

  return (
    <section className="py-16 bg-[#0C1816]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0C1816] mb-4">
            Trusted by <span className="text-[#0C1816]">Amazing Clients</span>
          </h2>
          <p className="text-lg text-emerald-300 max-w-2xl mx-auto">
            Working with forward-thinking companies to build systems that scale
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-12 md:gap-16"
        >
          {clients.map((client, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className="relative w-32 h-16 md:w-40 md:h-20">
                <Image
                  src={client.logoUrl}
                  alt={client.alt}
                  fill
                  className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                  sizes="(max-width: 768px) 128px, 160px"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Optional: Add a subtle call-to-action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-emerald-400">
            Ready to join them? Let's build something amazing together.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsSection;
