import React from 'react';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/question">
        Question
      </MenuItem>
      <MenuItem icon="asterisk" to="/survey">
        Survey
      </MenuItem>
      <MenuItem icon="asterisk" to="/answer">
        Answer
      </MenuItem>
      <MenuItem icon="asterisk" to="/survey-assigment">
        Survey Assigment
      </MenuItem>
      <MenuItem icon="asterisk" to="/group">
        Group
      </MenuItem>
      <MenuItem icon="asterisk" to="/survey-target-groups">
        Survey Target Groups
      </MenuItem>
      <MenuItem icon="asterisk" to="/group-assigment">
        Group Assigment
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
