import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getFeedback } from '../utils/feedback';

const Feedback = () => {
  const { responses, scores, currentQuestion } = useSelector((state) => state.interview);
  const latestResponse = responses[responses.length - 1]?.text || '';
  const latestScore = scores[scores.length - 1] || null;

  return (
    latestScore && (
      <motion.div
        className="mt-6 p-6 bg-gray-800/70 backdrop-blur-lg rounded-xl border border-neon/50 shadow-lg shadow-neon-pink/30"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-bold text-neon text-lg">Score: <span className="text-white">{latestScore}/100</span></p>
        <p className="text-white mt-2">{getFeedback(latestResponse, latestScore, currentQuestion - 1)}</p>
      </motion.div>
    )
  );
};

export default Feedback;