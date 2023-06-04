package com.pwr.students.repository;

import com.pwr.students.domain.SurveyAssigment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SurveyAssigment entity.
 */
@Repository
public interface SurveyAssigmentRepository extends JpaRepository<SurveyAssigment, Long> {
    @Query("select surveyAssigment from SurveyAssigment surveyAssigment where surveyAssigment.user.login = ?#{principal.username}")
    List<SurveyAssigment> findByUserIsCurrentUser();

    default Optional<SurveyAssigment> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<SurveyAssigment> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<SurveyAssigment> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select surveyAssigment from SurveyAssigment surveyAssigment left join fetch surveyAssigment.user",
        countQuery = "select count(surveyAssigment) from SurveyAssigment surveyAssigment"
    )
    Page<SurveyAssigment> findAllWithToOneRelationships(Pageable pageable);

    @Query("select surveyAssigment from SurveyAssigment surveyAssigment left join fetch surveyAssigment.user")
    List<SurveyAssigment> findAllWithToOneRelationships();

    @Query("select surveyAssigment from SurveyAssigment surveyAssigment left join fetch surveyAssigment.user where surveyAssigment.id =:id")
    Optional<SurveyAssigment> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("SELECT sa FROM SurveyAssigment sa WHERE sa.survey.id = :surveyId")
    List<SurveyAssigment> findAllBySurveyId(@Param("surveyId") Long surveyId);
}
