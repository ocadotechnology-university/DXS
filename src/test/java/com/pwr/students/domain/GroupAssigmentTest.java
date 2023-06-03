package com.pwr.students.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.pwr.students.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GroupAssigmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GroupAssigment.class);
        GroupAssigment groupAssigment1 = new GroupAssigment();
        groupAssigment1.setId(1L);
        GroupAssigment groupAssigment2 = new GroupAssigment();
        groupAssigment2.setId(groupAssigment1.getId());
        assertThat(groupAssigment1).isEqualTo(groupAssigment2);
        groupAssigment2.setId(2L);
        assertThat(groupAssigment1).isNotEqualTo(groupAssigment2);
        groupAssigment1.setId(null);
        assertThat(groupAssigment1).isNotEqualTo(groupAssigment2);
    }
}
