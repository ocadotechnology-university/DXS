import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './group-assigment.reducer';

export const GroupAssigmentDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const groupAssigmentEntity = useAppSelector(state => state.groupAssigment.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="groupAssigmentDetailsHeading">
          <Translate contentKey="dxsApp.groupAssigment.detail.title">GroupAssigment</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{groupAssigmentEntity.id}</dd>
          <dt>
            <Translate contentKey="dxsApp.groupAssigment.user">User</Translate>
          </dt>
          <dd>{groupAssigmentEntity.user ? groupAssigmentEntity.user.login : ''}</dd>
          <dt>
            <Translate contentKey="dxsApp.groupAssigment.group">Group</Translate>
          </dt>
          <dd>{groupAssigmentEntity.group ? groupAssigmentEntity.group.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/group-assigment" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/group-assigment/${groupAssigmentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default GroupAssigmentDetail;
