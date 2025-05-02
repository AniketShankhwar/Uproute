"use client";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/data/faqs";

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/20 shadow-lg text-white p-4 rounded-2xl max-w-5xl mx-auto">
      {faqs.map((faq, index) => (
        <div key={index} className="cursor-pointer">
          {/* Question Row */}
          <div
            className="flex justify-between items-center p-4"
            onClick={() => handleToggle(index)}
          >
            <span className="text-lg font-medium">{faq.question}</span>
            <ChevronRight
              className={`transition-transform transform ${
                openIndex === index ? "rotate-90" : "rotate-0"
              }`}
            />
          </div>

          {/* Animate the Answer */}
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-4 text-gray-400 text-sm">{faq.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider (Exclude for last item) */}
          {index < faqs.length - 1 && (
            <div className="w-[95%] mx-auto border-b border-gray-700"></div>
          )}
        </div>
      ))}
    </Card>
  );
}
