import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Question from './question';
import Survey from './survey';
import Answer from './answer';
import SurveyAssigment from './survey-assigment';
import Group from './group';
import SurveyTargetGroups from './survey-target-groups';
import GroupAssigment from './group-assigment';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="question/*" element={<Question />} />
        <Route path="survey/*" element={<Survey />} />
        <Route path="answer/*" element={<Answer />} />
        <Route path="survey-assigment/*" element={<SurveyAssigment />} />
        <Route path="group/*" element={<Group />} />
        <Route path="survey-target-groups/*" element={<SurveyTargetGroups />} />
        <Route path="group-assigment/*" element={<GroupAssigment />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
