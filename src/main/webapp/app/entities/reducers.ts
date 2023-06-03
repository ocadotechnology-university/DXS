import question from 'app/entities/question/question.reducer';
import survey from 'app/entities/survey/survey.reducer';
import answer from 'app/entities/answer/answer.reducer';
import surveyAssigment from 'app/entities/survey-assigment/survey-assigment.reducer';
import group from 'app/entities/group/group.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  question,
  survey,
  answer,
  surveyAssigment,
  group,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
