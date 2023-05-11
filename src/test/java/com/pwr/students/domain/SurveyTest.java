package com.pwr.students.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.pwr.students.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SurveyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Survey.class);
        Survey survey1 = new Survey();
        survey1.setId(1L);
        Survey survey2 = new Survey();
        survey2.setId(survey1.getId());
        assertThat(survey1).isEqualTo(survey2);
        survey2.setId(2L);
        assertThat(survey1).isNotEqualTo(survey2);
        survey1.setId(null);
        assertThat(survey1).isNotEqualTo(survey2);
    }
}
