package com.example.webapp.repositories;

import com.example.webapp.models.Article;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;


@DataJpaTest
class ArticleRepositoryTests {

    @Autowired
    private ArticleRepository articleRepository;

    @AfterEach
    void tearDown() {
        articleRepository.deleteAll();
    }

    /*
    Test 1:
    Article repository should check if article exists,
    given its title, in the MySQL database and return a boolean
    */
    @Test
    void itShouldCheckIfArticleExistsByTitle() {
        //given
        Article article = new Article(
                "test title",
                "https://url-test"
        );
        articleRepository.save(article);
        //when
        Boolean exists = articleRepository.existsByTitle(article.getTitle());
        //then
        assertThat(exists).isTrue();
    }

    /*
    Test 2:
    Article repository should check if article exists,
    given its URL, in the MySQL database and return a boolean
    */
    @Test
    void itShouldCheckIfArticleExistsByUrl() {
        //given
        Article article = new Article(
                "test title",
                "https://url-test"
        );
        articleRepository.save(article);
        //when
        Boolean exists = articleRepository.existsByUrl(article.getUrl());
        //then
        assertThat(exists).isTrue();
    }
}

