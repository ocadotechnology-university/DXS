package com.pwr.students.repository;

import com.pwr.students.domain.Question;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Question entity.
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    default Optional<Question> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Question> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Question> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct question from Question question left join fetch question.survey",
        countQuery = "select count(distinct question) from Question question"
    )
    Page<Question> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct question from Question question left join fetch question.survey")
    List<Question> findAllWithToOneRelationships();

    @Query("select distinct question from Question question where question.id =:id")
    Optional<Question> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("SELECT question FROM Question question WHERE question.survey.id = :surveyId")
    List<Question> findAllBySurveyId(@Param("surveyId") Long surveyId);
}
