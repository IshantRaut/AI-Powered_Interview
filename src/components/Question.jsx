import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { questions } from '../data/questions';

const Question = () => {
  const { currentQuestion, selectedTopic, responses } = useSelector((state) => state.interview);
  const topicQuestions = questions[selectedTopic] || [];
  const question = topicQuestions[currentQuestion] || { text: "Interview Complete!", solution: "" };
  const showSolution = responses.length > currentQuestion;

  return (
    <motion.div
      className="mt-12 w-full max-w-4xl text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold text-[#2C5282] p-6 bg-white rounded-lg border border-[#CBD5E0]">
        {question.text}
      </h2>
      {showSolution && (
        <motion.div
          className="mt-6 p-6 bg-white rounded-lg border border-[#CBD5E0]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-lg font-semibold text-[#38A169]">Solution:</p>
          <p className="text-[#1A202C] mt-2">{question.solution}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Question;