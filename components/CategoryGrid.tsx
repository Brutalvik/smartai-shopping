// components/CategoryGrid.tsx
"use client";

import { motion } from "framer-motion";

const categories = [
  { icon: "💻", label: "Computers" },
  { icon: "🎮", label: "Gaming" },
  { icon: "👕", label: "Fashion" },
  { icon: "📱", label: "Mobiles" },
  { icon: "🧸", label: "Toys" },
  { icon: "🎧", label: "Accessories" },
  { icon: "🖥️", label: "Monitors" },
  { icon: "🛒", label: "Grocery" },
];

export default function CategoryGrid() {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-white dark:to-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center text-default-900 dark:text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Don’t miss out on exclusive deals made for you.
        </motion.h2>

        <motion.p
          className="text-center text-default-500 text-base sm:text-lg mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          🚚 Free delivery on orders over $200
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={i}
              className="rounded-2xl py-6 px-4 flex flex-col items-center justify-center text-center border border-default-200 hover:scale-105 hover:shadow-lg transition-transform duration-300 bg-white/80 dark:bg-black/30"
              initial={{ opacity: 0, y: 20, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <p className="text-sm font-semibold text-default-800 dark:text-white">
                {category.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
