package com.pwr.students.repository;

import com.pwr.students.domain.Answer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Answer entity.
 */
@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    @Query("select answer from Answer answer where answer.user.login = ?#{principal.username}")
    List<Answer> findByUserIsCurrentUser();

    default Optional<Answer> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Answer> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Answer> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select answer from Answer answer left join fetch answer.user", countQuery = "select count(answer) from Answer answer")
    Page<Answer> findAllWithToOneRelationships(Pageable pageable);

    @Query("select answer from Answer answer left join fetch answer.user")
    List<Answer> findAllWithToOneRelationships();

    @Query("select answer from Answer answer left join fetch answer.user where answer.id =:id")
    Optional<Answer> findOneWithToOneRelationships(@Param("id") Long id);
}
