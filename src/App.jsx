import { useDispatch, useSelector } from 'react-redux';
import { startInterview } from './store/slices/interviewSlice';
import { motion } from 'framer-motion';
import Avatar from './components/Avatar';
import Question from './components/Question';
import Response from './components/Response';
import Dashboard from './components/Dashboard';
import FinalReport from './components/FinalReport';

function App() {
  const dispatch = useDispatch();
  const { isInterviewStarted, isInterviewFinished } = useSelector((state) => state.interview);

  const topics = [
    'javascript', 'react', 'python', 'hr', 'html', 'css', 'backend',
    'nodejs', 'expressjs', 'redux', 'mongodb', 'mysql',
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      {!isInterviewStarted ? (
        <motion.div
          className="flex-1 flex flex-col items-center justify-center p-12 space-y-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-[#2C5282] tracking-tight">
            Interview Simulator
          </h1>
          <p className="text-xl text-[#1A202C] max-w-3xl text-center">
            Prepare for your next interview with our AI-powered simulator. Select a topic to get started.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl">
            {topics.map((topic) => (
              <motion.button
                key={topic}
                className="bg-[#4A90E2] text-white px-8 py-4 rounded-lg font-semibold capitalize border border-[#4A90E2] hover:bg-[#2C5282] hover:border-[#2C5282] transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                onClick={() => dispatch(startInterview(topic))}
              >
                {topic}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ) : isInterviewFinished ? (
        <FinalReport />
      ) : (
        <div className="flex flex-col lg:flex-row min-h-screen">
          <motion.div
            className="lg:w-2/3 p-12 flex flex-col items-center justify-center bg-[#F7F9FC]"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar />
            <Question />
            <Response />
          </motion.div>
          <div className="lg:w-1/3 p-12 bg-[#F7F9FC]">
            <Dashboard />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;