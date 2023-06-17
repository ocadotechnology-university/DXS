package com.pwr.students.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Question.
 */
@Entity
@Table(name = "question")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Question implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "category", nullable = false)
    private String category;

    @NotNull
    @Column(name = "answer_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private AnswerType answerType;

    @NotNull
    @Size(min = 16, max = 255)
    @Column(name = "question_content", length = 255, nullable = false)
    private String questionContent;

    @NotNull
    @Column(name = "is_required", nullable = false)
    private Boolean isRequired;

    @Column(name = "jhi_order")
    private Integer order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "questions", "user" }, allowSetters = true)
    private Survey survey;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Question id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return this.category;
    }

    public Question category(String category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public AnswerType getAnswerType() {
        return this.answerType;
    }

    public Question answerType(AnswerType answerType) {
        this.setAnswerType(answerType);
        return this;
    }

    public void setAnswerType(AnswerType answerType) {
        this.answerType = answerType;
    }

    public String getQuestionContent() {
        return this.questionContent;
    }

    public Question questionContent(String questionContent) {
        this.setQuestionContent(questionContent);
        return this;
    }

    public void setQuestionContent(String questionContent) {
        this.questionContent = questionContent;
    }

    public Boolean getIsRequired() {
        return this.isRequired;
    }

    public Question isRequired(Boolean isRequired) {
        this.setIsRequired(isRequired);
        return this;
    }

    public void setIsRequired(Boolean isRequired) {
        this.isRequired = isRequired;
    }

    public Integer getOrder() {
        return this.order;
    }

    public Question order(Integer order) {
        this.setOrder(order);
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Survey getSurvey() {
        return this.survey;
    }

    public void setSurvey(Survey survey) {
        this.survey = survey;
    }

    public Question survey(Survey survey) {
        this.setSurvey(survey);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Question)) {
            return false;
        }
        return id != null && id.equals(((Question) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Question{" +
            "id=" + getId() +
            ", category='" + getCategory() + "'" +
            ", answerType='" + getAnswerType() + "'" +
            ", questionContent='" + getQuestionContent() + "'" +
            ", isRequired='" + getIsRequired() + "'" +
            ", order=" + getOrder() +
            "}";
    }
}
