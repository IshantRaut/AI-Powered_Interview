import React from 'react';
import { motion } from 'framer-motion';

const Avatar = () => {
  return (
    <motion.div
      className="w-32 h-32 mx-auto rounded-full flex items-center justify-center bg-[#4A90E2] border-2 border-[#2C5282]"
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ repeat: Infinity, duration: 2.5 }}
    >
      <span className="text-white text-4xl font-bold tracking-tight">AI</span>
    </motion.div>
  );
};

export default Avatar;