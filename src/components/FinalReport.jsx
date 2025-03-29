import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetInterview } from '../store/slices/interviewSlice';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { questions } from '../data/questions';
import jsPDF from 'jspdf';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinalReport = () => {
  const dispatch = useDispatch();
  const { responses, scores, selectedTopic, notes = [] } = useSelector((state) => state.interview);
  const chartRef = useRef(null);
  const topicQuestions = questions[selectedTopic] || [];

  const chartData = {
    labels: scores.map((_, index) => `Q${index + 1}`),
    datasets: [{ label: 'Score', data: scores, backgroundColor: '#38A169', borderColor: '#38A169', borderWidth: 1 }],
  };

  const chartOptions = {
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { color: '#1A202C', font: { size: 12 } }, grid: { color: '#CBD5E0' } },
      x: { ticks: { color: '#1A202C', font: { size: 12 } }, grid: { display: false } },
    },
    plugins: { legend: { labels: { color: '#1A202C', font: { size: 14 } } } },
    maintainAspectRatio: false,
  };

  const averageScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 'N/A';

  const exportToPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let yOffset = 10;
    pdf.setFontSize(20);
    pdf.setTextColor(44, 82, 130);
    pdf.text('Interview Report', 105, yOffset, { align: 'center' });
    yOffset += 15;
    pdf.setFontSize(14);
    pdf.setTextColor(26, 32, 44);
    pdf.text(`Average Score: ${averageScore}/100`, 10, yOffset);
    yOffset += 10;
    if (chartRef.current) {
      const chartImgData = chartRef.current.canvas.toDataURL('image/png');
      pdf.addImage(chartImgData, 'PNG', 10, yOffset, 190, 60);
      yOffset += 70;
    }
    responses.forEach((response, index) => {
      const questionText = `Q${index + 1}: ${topicQuestions[index].text}`;
      const answerText = `Your Answer: ${response.text}`;
      const solutionText = `Solution: ${topicQuestions[index].solution}`;
      const noteText = `Key Takeaway: ${notes[index] || 'N/A'}`;
      const splitQuestion = pdf.splitTextToSize(questionText, 180);
      const splitAnswer = pdf.splitTextToSize(answerText, 180);
      const splitSolution = pdf.splitTextToSize(solutionText, 180);
      const splitNote = pdf.splitTextToSize(noteText, 180);
      if (yOffset + (splitQuestion.length + splitAnswer.length + splitSolution.length + splitNote.length) * 7 > 270) {
        pdf.addPage();
        yOffset = 10;
      }
      pdf.setFontSize(12);
      pdf.setTextColor(44, 82, 130);
      pdf.text(splitQuestion, 10, yOffset);
      yOffset += splitQuestion.length * 7;
      pdf.setTextColor(26, 32, 44);
      pdf.text(splitAnswer, 10, yOffset);
      yOffset += splitAnswer.length * 7;
      pdf.setTextColor(74, 144, 226);
      pdf.text(splitSolution, 10, yOffset);
      yOffset += splitSolution.length * 7;
      pdf.setTextColor(56, 161, 105);
      pdf.text(splitNote, 10, yOffset);
      yOffset += splitNote.length * 7 + 10;
    });
    pdf.save('Interview_Report.pdf');
  };

  return (
    <div className="p-12 min-h-screen bg-[#F7F9FC]">
      <h1 className="text-5xl font-bold text-center text-[#2C5282] mb-12">Interview Performance Report</h1>
      <div className="max-w-5xl mx-auto space-y-10 bg-white p-8 rounded-lg border border-[#CBD5E0]">
        <p className="text-xl font-semibold text-[#1A202C]">
          Average Score: <span className="text-[#38A169]">{averageScore}/100</span>
        </p>
        <div className="h-80 bg-white p-6 rounded-md border border-[#CBD5E0]">
          <Bar ref={chartRef} data={chartData} options={chartOptions} />
        </div>
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-[#2C5282]">Responses, Solutions & Notes</h2>
          {responses.map((response, index) => (
            <div key={index} className="p-6 bg-white rounded-lg border border-[#CBD5E0]">
              <p className="font-semibold text-[#2C5282] text-lg">Q{index + 1}: Score <span className="text-[#38A169]">{scores[index]}/100</span></p>
              <p className="text-[#1A202C] mt-2">Your Answer: {response.text}</p>
              <p className="text-[#4A90E2] mt-2">Solution: {topicQuestions[index].solution}</p>
              <p className="text-[#38A169] mt-2">Key Takeaway: {notes[index] || 'N/A'}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex space-x-6">
          <button
            className="w-full bg-[#4A90E2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2C5282] transition-all duration-300 border border-[#4A90E2]"
            onClick={() => dispatch(resetInterview())}
          >
            Start New Interview
          </button>
          <button
            className="w-full bg-[#38A169] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2F855A] transition-all duration-300 border border-[#38A169]"
            onClick={exportToPDF}
          >
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalReport;