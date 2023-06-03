package com.pwr.students.repository;

import com.pwr.students.domain.SurveyTargetGroups;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SurveyTargetGroups entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SurveyTargetGroupsRepository extends JpaRepository<SurveyTargetGroups, Long> {}
