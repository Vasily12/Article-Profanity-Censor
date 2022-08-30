package com.example.webapp.repositories;

import com.example.webapp.models.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;


public interface ArticleRepository extends JpaRepository<Article,Long> {

    Article findByTitle(String title);

    @Query(value = "select article_id from user_articles where user_id = ?1", nativeQuery = true)
    List<Long> findByUserId(Long id);

    Boolean existsByTitle(String title);

    Boolean existsByUrl(String url);
}
