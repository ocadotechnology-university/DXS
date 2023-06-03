package com.pwr.students.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.pwr.students.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SurveyTargetGroupsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SurveyTargetGroups.class);
        SurveyTargetGroups surveyTargetGroups1 = new SurveyTargetGroups();
        surveyTargetGroups1.setId(1L);
        SurveyTargetGroups surveyTargetGroups2 = new SurveyTargetGroups();
        surveyTargetGroups2.setId(surveyTargetGroups1.getId());
        assertThat(surveyTargetGroups1).isEqualTo(surveyTargetGroups2);
        surveyTargetGroups2.setId(2L);
        assertThat(surveyTargetGroups1).isNotEqualTo(surveyTargetGroups2);
        surveyTargetGroups1.setId(null);
        assertThat(surveyTargetGroups1).isNotEqualTo(surveyTargetGroups2);
    }
}
