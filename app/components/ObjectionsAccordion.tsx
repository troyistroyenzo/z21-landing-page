'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import content from '@/app/content/z21.json';

export default function ObjectionsAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-emerald-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
          {content.objections.title}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {content.objections.items.map((item, index) => (
            <div
              key={index}
              className="border border-rust/20 rounded-lg overflow-hidden bg-paper/5 backdrop-blur-sm"
            >
              <button
                onClick={() => handleToggle(index)}
                aria-expanded={openIndex === index}
                aria-controls={`objection-answer-${index}`}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-rust/5 focus:outline-none focus:ring-2 focus:ring-rust focus:ring-offset-2 focus:ring-offset-emerald-950"
              >
                <span className="font-semibold text-white">{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-rust transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={`objection-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-4 text-white/80">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
