import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import Login from 'app/modules/login/login';
import Register from 'app/modules/account/register/register';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/login/logout';
import Home from 'app/modules/home/home';
import EntitiesRoutes from 'app/entities/routes';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import { AUTHORITIES } from 'app/config/constants';
import SurveyCreator from 'app/modules/surveyCreator/surveyCreator';
import QuestionManager from 'app/modules/questionManager/questionManager';
import UserSurveysDashboard from 'app/modules/userSurveysDashboard/userSurveysDashboard';
import ManagerSurveysDashboard from 'app/modules/managerSurveysDashboard/managerSurveysDashboard';
import SurveyPage from 'app/modules/surveyCompletion/survey-page';
import SurveyStatusView from 'app/modules/SurveyStatusView/SurveyStatusView';
import QuestionModification from 'app/modules/questionModification/questionModification';
import SurveyModification from 'app/modules/surveyModification/surveyModification';
import SurveyHistory from 'app/modules/SurveyHistory/SurveyHistory';

const loading = <div>loading ...</div>;

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => loading,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => loading,
});

const AppRoutes = () => {
  return (
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route
          path="surveyCreator"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER, AUTHORITIES.MANAGER]}>
              <SurveyCreator />
            </PrivateRoute>
          }
        />
        <Route
          path="questionManager"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER, AUTHORITIES.MANAGER]}>
              <QuestionManager />
            </PrivateRoute>
          }
        />
        <Route
          path="questionModification"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER, AUTHORITIES.MANAGER]}>
              <QuestionModification />
            </PrivateRoute>
          }
        />
        <Route
          path="survey-modification"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER, AUTHORITIES.MANAGER]}>
              <SurveyModification />
            </PrivateRoute>
          }
        />
        <Route
          path="user-surveys-dashboard"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER, AUTHORITIES.MANAGER]}>
              <UserSurveysDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/complete-survey/:surveyId"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER, AUTHORITIES.MANAGER]}>
              <SurveyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="manager-surveys-dashboard"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.MANAGER]}>
              <ManagerSurveysDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="SurveyHistory/:surveyId/:userId"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.MANAGER, AUTHORITIES.USER]}>
              <SurveyHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="SurveyStatusView/:surveyId"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.MANAGER]}>
              <SurveyStatusView />
            </PrivateRoute>
          }
        />

        <Route path="account">
          <Route
            path="*"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER, AUTHORITIES.MANAGER]}>
                <Account />
              </PrivateRoute>
            }
          />
          <Route path="register" element={<Register />} />
          <Route path="activate" element={<Activate />} />
          <Route path="reset">
            <Route path="request" element={<PasswordResetInit />} />
            <Route path="finish" element={<PasswordResetFinish />} />
          </Route>
        </Route>
        <Route
          path="admin/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.MANAGER]}>
              <EntitiesRoutes />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
