import question from 'app/entities/question/question.reducer';
import survey from 'app/entities/survey/survey.reducer';
import answer from 'app/entities/answer/answer.reducer';
import surveyAssigment from 'app/entities/survey-assigment/survey-assigment.reducer';
import group from 'app/entities/group/group.reducer';
import surveyTargetGroups from 'app/entities/survey-target-groups/survey-target-groups.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  question,
  survey,
  answer,
  surveyAssigment,
  group,
  surveyTargetGroups,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
