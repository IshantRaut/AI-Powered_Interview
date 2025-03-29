import { questions } from '../data/questions';

export const getFeedback = (responseText, score, questionIndex) => {
  if (!responseText) return '';

  const currentQ = questions[questionIndex] || {};
  const wordCount = responseText.split(/\s+/).filter(Boolean).length;
  const keywords = currentQ.keywords || [];
  const lowerResponse = responseText.toLowerCase();
  const synonymMap = {
    experience: ['skills', 'background', 'expertise'],
    skills: ['abilities', 'competencies', 'experience'],
    teamwork: ['collaboration', 'group', 'cooperation'],
    'problem-solving': ['solutions', 'resolve', 'fix'],
    solution: ['answer', 'resolution', 'fix'],
    overcame: ['conquered', 'surmounted', 'handled'],
  };
  const keywordMatches = keywords.filter((kw) => lowerResponse.includes(kw.toLowerCase())).length;
  const synonymMatches = keywords.some((kw) =>
    synonymMap[kw]?.some((syn) => lowerResponse.includes(syn.toLowerCase()))
  );
  const sentences = responseText.split(/[.!?]+/).filter(Boolean);
  const sentenceCount = sentences.length;
  const avgSentenceLength = wordCount / sentenceCount;
  const fillerWords = ['um', 'like', 'uh', 'you know'];
  const fillerCount = fillerWords.reduce((count, filler) => {
    return count + (lowerResponse.match(new RegExp(`\\b${filler}\\b`, 'g')) || []).length;
  }, 0);
  const positiveWords = ['good', 'great', 'excellent', 'strong', 'success', 'achieved', 'positive'];
  const negativeWords = ['bad', 'poor', 'failed', 'weak', 'problem', 'negative'];
  const sentimentScore = positiveWords.reduce((sum, word) => sum + (lowerResponse.includes(word) ? 2 : 0), 0) -
    negativeWords.reduce((sum, word) => sum + (lowerResponse.includes(word) ? 2 : 0), 0);

  let feedback = '';
  if (score >= 85) {
    feedback = "Excellent! Your answer is clear, relevant, and well-structured.";
  } else if (score >= 70) {
    feedback = "Good job! Solid response, but there’s room to refine it.";
  } else if (score >= 50) {
    feedback = "Fair effort. Expand your ideas and focus on the question.";
  } else {
    feedback = "Needs work. Lack of depth or clarity—try elaborating.";
  }

  if (wordCount < 5) feedback += " Too short—add more detail.";
  if (wordCount > 150) feedback += " Too lengthy—keep it concise.";
  if (keywordMatches === 0) {
    feedback += ` Missing keywords like "${keywords[0]}". Try synonyms like "${synonymMap[keywords[0]]?.[0]}" if applicable.`;
  } else if (keywordMatches < keywords.length && synonymMatches) {
    feedback += " Good use of related terms, but include more specific keywords.";
  }
  if (sentenceCount < 3) feedback += " Use more sentences for better flow.";
  if (avgSentenceLength < 5 || avgSentenceLength > 20) feedback += " Adjust sentence length for readability (5-20 words).";
  if (fillerCount > 0) feedback += ` Remove fillers like "um" or "like" (used ${fillerCount} times).`;
  if (sentimentScore < 0) feedback += " Avoid negative tone—focus on positives.";
  else if (sentimentScore > 0) feedback += " Nice positive tone!";

  return feedback;
};