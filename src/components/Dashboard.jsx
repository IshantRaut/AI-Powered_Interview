import React from 'react';
import { useSelector } from 'react-redux';
import { questions } from '../data/questions';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { currentQuestion, scores, selectedTopic } = useSelector((state) => state.interview);
  const topicQuestions = questions[selectedTopic] || [];
  const progress = (currentQuestion / topicQuestions.length) * 100;

  const chartData = {
    labels: scores.map((_, index) => `Q${index + 1}`),
    datasets: [{ label: 'Score', data: scores, backgroundColor: '#38A169', borderColor: '#38A169', borderWidth: 1 }],
  };

  const chartOptions = {
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { color: '#1A202C', font: { size: 12 } }, grid: { color: '#CBD5E0' } },
      x: { title: { display: true, text: 'Questions', color: '#1A202C', font: { size: 14 } }, ticks: { color: '#1A202C', font: { size: 12 } }, grid: { display: false } },
    },
    plugins: { legend: { labels: { color: '#1A202C', font: { size: 14 } } }, tooltip: { enabled: true } },
    maintainAspectRatio: false,
  };

  return (
    <div className="space-y-8 p-8 bg-white rounded-lg border border-[#CBD5E0]">
      <div>
        <p className="text-lg font-semibold text-[#2C5282]">
          Progress: <span className="text-[#1A202C]">{currentQuestion}/{topicQuestions.length}</span>
        </p>
        <div className="w-full bg-[#CBD5E0] rounded-full h-4 mt-2">
          <div className="bg-[#4A90E2] h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <p className="text-lg font-semibold text-[#2C5282]">
        Average Score: <span className="text-[#38A169]">{scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 'N/A'}</span>
      </p>
      {scores.length > 0 && (
        <div className="h-72 bg-white p-6 rounded-md border border-[#CBD5E0]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;