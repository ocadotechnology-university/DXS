import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import GroupAssigment from './group-assigment';
import GroupAssigmentDetail from './group-assigment-detail';
import GroupAssigmentUpdate from './group-assigment-update';
import GroupAssigmentDeleteDialog from './group-assigment-delete-dialog';

const GroupAssigmentRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<GroupAssigment />} />
    <Route path="new" element={<GroupAssigmentUpdate />} />
    <Route path=":id">
      <Route index element={<GroupAssigmentDetail />} />
      <Route path="edit" element={<GroupAssigmentUpdate />} />
      <Route path="delete" element={<GroupAssigmentDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default GroupAssigmentRoutes;
