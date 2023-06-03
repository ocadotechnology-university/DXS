import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ISurvey } from 'app/shared/model/survey.model';
import { getEntities as getSurveys } from 'app/entities/survey/survey.reducer';
import { IGroup } from 'app/shared/model/group.model';
import { getEntities as getGroups } from 'app/entities/group/group.reducer';
import { ISurveyTargetGroups } from 'app/shared/model/survey-target-groups.model';
import { getEntity, updateEntity, createEntity, reset } from './survey-target-groups.reducer';

export const SurveyTargetGroupsUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const surveys = useAppSelector(state => state.survey.entities);
  const groups = useAppSelector(state => state.group.entities);
  const surveyTargetGroupsEntity = useAppSelector(state => state.surveyTargetGroups.entity);
  const loading = useAppSelector(state => state.surveyTargetGroups.loading);
  const updating = useAppSelector(state => state.surveyTargetGroups.updating);
  const updateSuccess = useAppSelector(state => state.surveyTargetGroups.updateSuccess);

  const handleClose = () => {
    navigate('/survey-target-groups');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getSurveys({}));
    dispatch(getGroups({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...surveyTargetGroupsEntity,
      ...values,
      survey: surveys.find(it => it.id.toString() === values.survey.toString()),
      group: groups.find(it => it.id.toString() === values.group.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...surveyTargetGroupsEntity,
          survey: surveyTargetGroupsEntity?.survey?.id,
          group: surveyTargetGroupsEntity?.group?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="dxsApp.surveyTargetGroups.home.createOrEditLabel" data-cy="SurveyTargetGroupsCreateUpdateHeading">
            <Translate contentKey="dxsApp.surveyTargetGroups.home.createOrEditLabel">Create or edit a SurveyTargetGroups</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="survey-target-groups-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField id="survey-target-groups-survey" name="survey" data-cy="survey" label="Survey" type="select">
                <option value="" key="0" />
                {surveys
                  ? surveys.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="survey-target-groups-group" name="group" data-cy="group" label="Group" type="select">
                <option value="" key="0" />
                {groups
                  ? groups.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/survey-target-groups" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SurveyTargetGroupsUpdate;
