package com.pwr.students.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Survey.
 */
@Entity
@Table(name = "survey")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Survey implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 3, max = 120)
    @Column(name = "name", length = 120, nullable = false)
    private String name;

    @NotNull
    @Size(min = 16, max = 255)
    @Column(name = "description", length = 255, nullable = false)
    private String description;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "status")
    private String status;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "survey")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "survey" }, allowSetters = true)
    private Set<Question> questions = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "rel_survey__user", joinColumns = @JoinColumn(name = "survey_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<User> users = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Survey id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Survey name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Survey description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDeadline() {
        return this.deadline;
    }

    public Survey deadline(LocalDate deadline) {
        this.setDeadline(deadline);
        return this;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getStatus() {
        return this.status;
    }

    public Survey status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<Question> getQuestions() {
        return this.questions;
    }

    public void setQuestions(Set<Question> questions) {
        if (this.questions != null) {
            this.questions.forEach(i -> i.setSurvey(null));
        }
        if (questions != null) {
            questions.forEach(i -> i.setSurvey(this));
        }
        this.questions = questions;
    }

    public Survey questions(Set<Question> questions) {
        this.setQuestions(questions);
        return this;
    }

    public Survey addQuestion(Question question) {
        this.questions.add(question);
        question.setSurvey(this);
        return this;
    }

    public Survey removeQuestion(Question question) {
        this.questions.remove(question);
        question.setSurvey(null);
        return this;
    }

    public Set<User> getUsers() {
        return this.users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Survey users(Set<User> users) {
        this.setUsers(users);
        return this;
    }

    public Survey addUser(User user) {
        this.users.add(user);
        return this;
    }

    public Survey removeUser(User user) {
        this.users.remove(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Survey)) {
            return false;
        }
        return id != null && id.equals(((Survey) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Survey{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", deadline='" + getDeadline() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
