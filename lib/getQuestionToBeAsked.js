const sample = require('lodash/sample');
const questions = require('../data/questions.json');

//get all questions for a specific person
function getQuestionsForPerson(personId) {
  return questions.filter(question => {
   return question.askers.includes(personId)
  })
}

module.exports = function getQuestionToBeAsked(personId) {
  if (questions.length === 1) {
    return {finished: true };
  }
  const potentialQuestions = getQuestionsForPerson(personId);
  if (potentialQuestions.length === 0) {
    return;
  }  
  const question = sample(potentialQuestions);
  if(!question.isPermanent) {
    questions.splice(questions.indexOf(question), 1)
  }
  return question;
}