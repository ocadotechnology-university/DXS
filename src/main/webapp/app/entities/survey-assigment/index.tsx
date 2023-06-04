import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import SurveyAssigment from './survey-assigment';
import SurveyAssigmentDetail from './survey-assigment-detail';
import SurveyAssigmentUpdate from './survey-assigment-update';
import SurveyAssigmentDeleteDialog from './survey-assigment-delete-dialog';

const SurveyAssigmentRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<SurveyAssigment />} />
    <Route path="new" element={<SurveyAssigmentUpdate />} />
    <Route path=":id">
      <Route index element={<SurveyAssigmentDetail />} />
      <Route path="edit" element={<SurveyAssigmentUpdate />} />
      <Route path="delete" element={<SurveyAssigmentDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SurveyAssigmentRoutes;
