import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import SurveyTargetGroups from './survey-target-groups';
import SurveyTargetGroupsDetail from './survey-target-groups-detail';
import SurveyTargetGroupsUpdate from './survey-target-groups-update';
import SurveyTargetGroupsDeleteDialog from './survey-target-groups-delete-dialog';

const SurveyTargetGroupsRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<SurveyTargetGroups />} />
    <Route path="new" element={<SurveyTargetGroupsUpdate />} />
    <Route path=":id">
      <Route index element={<SurveyTargetGroupsDetail />} />
      <Route path="edit" element={<SurveyTargetGroupsUpdate />} />
      <Route path="delete" element={<SurveyTargetGroupsDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SurveyTargetGroupsRoutes;
