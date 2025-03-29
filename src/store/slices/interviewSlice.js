import { createSlice } from '@reduxjs/toolkit';
import { questions } from '../../data/questions';

const initialState = {
  currentQuestion: 0,
  responses: [],
  scores: [],
  isInterviewStarted: false,
  isInterviewFinished: false,
  selectedTopic: null,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    startInterview(state, action) {
      state.isInterviewStarted = true;
      state.selectedTopic = action.payload;
    },
    nextQuestion(state) {
      state.currentQuestion += 1;
    },
    addResponse(state, action) {
      state.responses.push(action.payload.response);
      state.scores.push(action.payload.score);
      if (state.currentQuestion + 1 >= questions[state.selectedTopic].length) {
        state.isInterviewFinished = true;
      }
      state.notes = state.notes || [];
      state.notes.push(action.payload.notes);
    },
    endInterview(state) { // New action
      state.isInterviewFinished = true;
    },
    resetInterview(state) {
      state.isInterviewStarted = false;
      state.isInterviewFinished = false;
      state.selectedTopic = null;
      state.currentQuestion = 0;
      state.responses = [];
      state.scores = [];
      state.notes = [];
    },
  },
});

export const { startInterview, addResponse, nextQuestion, endInterview, resetInterview } = interviewSlice.actions;
export default interviewSlice.reducer;