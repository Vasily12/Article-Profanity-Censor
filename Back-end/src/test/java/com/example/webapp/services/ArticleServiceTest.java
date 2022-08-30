package com.example.webapp.services;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.webapp.models.Article;
import com.example.webapp.models.User;
import com.example.webapp.payloads.response.MessageRes;
import com.example.webapp.repositories.ArticleRepository;
import com.example.webapp.repositories.UserRepository;
import java.util.*;
import java.util.ArrayList;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;


@ContextConfiguration(classes = {ArticleService.class})
@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {
    @Mock
    private ArticleRepository articleRepository;


    private ArticleService articleService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        articleService = new ArticleService(articleRepository, userRepository);
    }

    @Test
    void testSave() {
        String title = "articleTitle";
        String url = "https://article.com";
        String email = "testEmail@test.com";

        List<Article> articles = new ArrayList<>();
        Article article = new Article();
        article.setTitle(title);
        article.setUrl(url);

        User user = new User();
        user.setUsername("testUsername");
        user.setEmail("testEmail@test.com");
        user.setPassword("testPassword");
        user.setArticles(articles);

        when(userRepository.existsByEmail(email)).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(user);

        articleService.save(email, title, url);

        articles.add(article);
        user.setArticles(articles);

        ArgumentCaptor<User> userArgumentCaptor =
                ArgumentCaptor.forClass(User.class);
        ArgumentCaptor<Article> articleArgumentCaptor =
                ArgumentCaptor.forClass(Article.class);

        verify(articleRepository).save(articleArgumentCaptor.capture());
        verify(userRepository).save(userArgumentCaptor.capture());

        Article capturedArticle = articleArgumentCaptor.getValue();
        User capturedUser = userArgumentCaptor.getValue();

        assertThat(capturedArticle.getTitle()).isEqualTo(title);
        assertThat(capturedArticle.getUrl()).isEqualTo(url);
        assertThat(capturedUser).isEqualTo(user);
    }

    @Test
    void ifArticleExistsShouldFindAndDelete() {
        //given
        Article testArticle = new Article("Test Title", "https://test.com");
        ArrayList<Article> testArticleList = new ArrayList<>();
        testArticleList.add(testArticle);

        User user = new User();
        user.setUsername("testUsername");
        user.setEmail("testEmail@test.com");
        user.setPassword("testPassword");
        user.setArticles(testArticleList);

        //when
        when(this.userRepository.findByEmail((String) any())).thenReturn(user);

        ResponseEntity<MessageRes> actualFindAndDeleteResult =
                this.articleService.findAndDelete("testEmail@test.com", "Test Title");

        //then
        verify(userRepository).findByEmail(user.getEmail());
        verify(articleRepository).delete(testArticle);
        verify(userRepository).save(user);
        assertEquals(HttpStatus.OK, actualFindAndDeleteResult.getStatusCode());
        assertEquals("Article Deleted", actualFindAndDeleteResult.getBody().getMessage());
    }

    @Test
    void ifUserHasNoSavedArticlesShouldReturnError() {
        //given
        User user = new User();
        user.setUsername("testUsername");
        user.setEmail("testEmail@test.com");
        user.setPassword("testPassword");
        user.setArticles(new ArrayList<>());

        //when
        when(userRepository.findByEmail((String) any())).thenReturn(user);
        when(userRepository.existsByEmail((String) any())).thenReturn(true);
        ResponseEntity<?> returnedArticles = articleService.getArticles("testEmail@test.com");

        //then
        verify(userRepository).findByEmail((String) any());
        verify(userRepository).existsByEmail((String) any());
        assertEquals(HttpStatus.BAD_REQUEST, returnedArticles.getStatusCode());
        assertEquals("No saved articles found", ((MessageRes) returnedArticles.getBody()).getMessage());
    }

    @Test
    void ifUserHasSavedArticlesShouldReturnSavedArticle() {
        //given
        Article testArticle = new Article("Test Title", "https://test.com");
        ArrayList<Article> testArticleList = new ArrayList<>();
        testArticleList.add(testArticle);

        User user = new User();
        user.setUsername("testUsername");
        user.setEmail("testEmail@test.com");
        user.setPassword("testPassword");
        user.setArticles(testArticleList);

        //when
        when(userRepository.existsByEmail((String) any())).thenReturn(true);
        when(userRepository.findByEmail((String) any())).thenReturn(user);
        ResponseEntity<?> actualArticles = articleService.getArticles("testEmail@test.com");

        //then
        verify(userRepository).findByEmail((String) any());
        verify(userRepository).existsByEmail((String) any());
        assertEquals(HttpStatus.OK, actualArticles.getStatusCode());
        assertEquals(actualArticles.getBody(), testArticleList);
    }

    @Test
    void ifEmailDoesNotExistShouldReturnError() {
        //when
        when(userRepository.existsByEmail((String) any())).thenReturn(false);
        ResponseEntity<?> actualArticles = articleService.getArticles("incorrectTestEmail@test.com");

        //then
        verify(userRepository).existsByEmail((String) any());
        assertEquals(HttpStatus.BAD_REQUEST, actualArticles.getStatusCode());
        assertEquals("User not found", ((MessageRes) actualArticles.getBody()).getMessage());
    }


}

