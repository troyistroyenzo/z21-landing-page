'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StarFilledIcon, StarIcon, PersonIcon } from '@radix-ui/react-icons';

const ReviewsSection = () => {
  const reviews = [
    {
      name: "Alex Thompson",
      avatar: "AT",
      rating: 5,
      date: "2 weeks ago",
      review: "Best investment I've made in my business. The ROI was immediate."
    },
    {
      name: "Jennifer Lee",
      avatar: "JL",
      rating: 5,
      date: "1 month ago",
      review: "Finally, a program that delivers on its promises. Real systems, real results."
    },
    {
      name: "David Park",
      avatar: "DP",
      rating: 5,
      date: "3 weeks ago",
      review: "The support alone is worth 10x the price. This community is incredible."
    },
    {
      name: "Maria Garcia",
      avatar: "MG",
      rating: 5,
      date: "1 week ago",
      review: "Went from idea to $5K in revenue in under 30 days. Mind blown."
    },
    {
      name: "Robert Chen",
      avatar: "RC",
      rating: 5,
      date: "2 months ago",
      review: "Stop thinking about it and just join. Your future self will thank you."
    },
    {
      name: "Lisa Anderson",
      avatar: "LA",
      rating: 5,
      date: "6 days ago",
      review: "The curriculum is gold, but the live calls are pure diamonds."
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      index < rating ? (
        <StarFilledIcon key={index} className="w-4 h-4 text-yellow-400" />
      ) : (
        <StarIcon key={index} className="w-4 h-4 text-gray-300" />
      )
    ));
  };

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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Join <span className="text-green-600">500+ Founders</span>
          </h2>
          <p className="text-xl text-gray-600">
            Who've already transformed their businesses
          </p>
          
          {/* Overall rating */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(5)}
            </div>
            <span className="text-2xl font-bold text-gray-900">5.0</span>
            <span className="text-gray-600">(500+ reviews)</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{review.name}</div>
                  <div className="text-xs text-gray-500">{review.date}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mb-3">
                {renderStars(review.rating)}
              </div>
              
              <p className="text-gray-700">
                "{review.review}"
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white rounded-full px-6 py-3 shadow-sm">
            <PersonIcon className="w-4 h-4" />
            <span>Join 80+ founders in the next cohort</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
