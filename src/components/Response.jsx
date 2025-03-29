import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addResponse, nextQuestion, endInterview } from '../store/slices/interviewSlice';
import { questions } from '../data/questions';
import debounce from 'lodash/debounce';

const Response = () => {
  const [answer, setAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [aiScore, setAiScore] = useState(null);
  const [doubt, setDoubt] = useState('');
  const [doubtResponse, setDoubtResponse] = useState('');
  const dispatch = useDispatch();
  const { currentQuestion, selectedTopic } = useSelector((state) => state.interview);
  const topicQuestions = questions[selectedTopic] || [];
  const currentQ = topicQuestions[currentQuestion] || {};

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const fetchAiFeedback = async (answerText, questionText) => {
    if (!answerText || !questionText) {
      setAiFeedback('Start typing to get feedback.');
      setAiScore(null);
      return;
    }
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: `Evaluate this answer: "${answerText}" for the question: "${questionText}". Provide concise feedback (max 50 words) and a score (0-100) in the format: "Feedback: [text]\nScore: [number]".` }] }] }) }
      );
      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No feedback available.';
      const feedbackMatch = result.match(/Feedback: (.*?)\nScore: (\d+)/s);
      if (feedbackMatch) {
        setAiFeedback(feedbackMatch[1]);
        setAiScore(Math.max(0, Math.min(parseInt(feedbackMatch[2], 10), 100)));
      } else {
        setAiFeedback(result);
        setAiScore(null);
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      setAiFeedback('Feedback unavailable—try again later.');
      setAiScore(null);
    }
  };

  const fetchDoubtResponse = async (doubtText) => {
    if (!doubtText) {
      setDoubtResponse('Please enter a question.');
      return;
    }
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: `Provide a concise answer (max 100 words) to this question: "${doubtText}" related to ${selectedTopic}.` }] }] }) }
      );
      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer available.';
      setDoubtResponse(answer);
    } catch (error) {
      console.error('Gemini API error:', error);
      setDoubtResponse('Answer unavailable—try again later.');
    }
  };

  const fetchNotes = async (answerText, questionText) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize this answer: "${answerText}" for the question: "${questionText}" into a key takeaway note (max 30 words).` }] }] }) }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No notes generated.';
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Notes unavailable.';
    }
  };

  const debouncedFetchAiFeedback = debounce((answer, question) => fetchAiFeedback(answer, question), 1000);

  useEffect(() => {
    debouncedFetchAiFeedback(answer, currentQ.text);
    return () => debouncedFetchAiFeedback.cancel();
  }, [answer, currentQ.text]);

  const handleSubmit = async () => {
    if (!answer) {
      setAiFeedback('Please provide an answer before submitting.');
      return;
    }
    const score = aiScore !== null ? aiScore : 0;
    const notes = await fetchNotes(answer, currentQ.text);
    dispatch(addResponse({ response: { text: answer, video: null }, score, notes }));
    dispatch(nextQuestion());
    setAnswer('');
    setAiFeedback('');
    setAiScore(null);
    setDoubtResponse('');
  };

  const handleEndInterview = async () => {
    if (answer) {
      const score = aiScore !== null ? aiScore : 0;
      const notes = await fetchNotes(answer, currentQ.text);
      dispatch(addResponse({ response: { text: answer, video: null }, score, notes }));
    }
    dispatch(endInterview());
  };

  const handleAskAi = () => {
    fetchDoubtResponse(doubt);
    setDoubt('');
  };

  return (
    <div className="mt-12 w-full max-w-3xl space-y-8">
      <input
        className="w-full p-4 bg-white text-[#1A202C] rounded-lg border border-[#CBD5E0] focus:border-[#4A90E2] focus:outline-none placeholder-[#A0AEC0] text-lg"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter your response here..."
      />
      {aiFeedback && (
        <div className="p-6 bg-white text-[#1A202C] rounded-lg border border-[#CBD5E0]">
          <p><strong className="text-[#2C5282]">AI Feedback:</strong> {aiFeedback}</p>
          {aiScore !== null && <p><strong className="text-[#2C5282]">Score:</strong> <span className="text-[#38A169]">{aiScore}/100</span></p>}
        </div>
      )}
      <div className="space-y-6">
        <input
          className="w-full p-4 bg-white text-[#1A202C] rounded-lg border border-[#CBD5E0] focus:border-[#4A90E2] focus:outline-none placeholder-[#A0AEC0] text-lg"
          value={doubt}
          onChange={(e) => setDoubt(e.target.value)}
          placeholder="Ask a question (e.g., What’s a closure?)"
        />
        <button
          className="w-full bg-[#4A90E2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2C5282] transition-all duration-300 border border-[#4A90E2]"
          onClick={handleAskAi}
        >
          Ask AI
        </button>
        {doubtResponse && (
          <div className="p-6 bg-white text-[#1A202C] rounded-lg border border-[#CBD5E0]">
            <p><strong className="text-[#2C5282]">AI Answer:</strong> {doubtResponse}</p>
          </div>
        )}
      </div>
      <div className="flex space-x-6">
        <button
          className="w-1/2 bg-[#38A169] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2F855A] transition-all duration-300 border border-[#38A169]"
          onClick={handleSubmit}
        >
          Submit Response
        </button>
        <button
          className="w-1/2 bg-[#4A90E2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2C5282] transition-all duration-300 border border-[#4A90E2]"
          onClick={handleEndInterview}
        >
          End Interview
        </button>
      </div>
    </div>
  );
};

export default Response;