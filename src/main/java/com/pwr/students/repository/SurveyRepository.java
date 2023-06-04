package com.pwr.students.repository;

import com.pwr.students.domain.Survey;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Survey entity.
 *
 * When extending this class, extend SurveyRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    @Query("select survey from Survey survey where survey.user.login = ?#{principal.username}")
    List<Survey> findByUserIsCurrentUser();

    default Optional<Survey> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Survey> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Survey> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select survey from Survey survey left join fetch survey.user", countQuery = "select count(survey) from Survey survey")
    Page<Survey> findAllWithToOneRelationships(Pageable pageable);

    @Query("select survey from Survey survey left join fetch survey.user")
    List<Survey> findAllWithToOneRelationships();

    @Query("select survey from Survey survey left join fetch survey.user where survey.id =:id")
    Optional<Survey> findOneWithToOneRelationships(@Param("id") Long id);
}
