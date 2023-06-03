package com.pwr.students.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.pwr.students.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SurveyAssigmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SurveyAssigment.class);
        SurveyAssigment surveyAssigment1 = new SurveyAssigment();
        surveyAssigment1.setId(1L);
        SurveyAssigment surveyAssigment2 = new SurveyAssigment();
        surveyAssigment2.setId(surveyAssigment1.getId());
        assertThat(surveyAssigment1).isEqualTo(surveyAssigment2);
        surveyAssigment2.setId(2L);
        assertThat(surveyAssigment1).isNotEqualTo(surveyAssigment2);
        surveyAssigment1.setId(null);
        assertThat(surveyAssigment1).isNotEqualTo(surveyAssigment2);
    }
}
