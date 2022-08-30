package com.example.webapp.controllers;

import com.example.webapp.payloads.request.DeleteSavedArticleRequest;
import com.example.webapp.payloads.request.GetArticlesRequest;
import com.example.webapp.payloads.request.SaveArticleRequest;
import com.example.webapp.services.ArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @PostMapping("/save/article")
    public ResponseEntity<?> saveUserArticle(@Valid @RequestBody SaveArticleRequest saveArticleRequest){
        return articleService.save(saveArticleRequest.getEmail(),saveArticleRequest.getTitle(),saveArticleRequest.getUrl());
    }

    @PostMapping("/get/articles")
    public ResponseEntity<?> getUserArticles(@Valid @RequestBody GetArticlesRequest getArticlesRequest){
        return articleService.getArticles(getArticlesRequest.getEmail());
    }

    @PostMapping("/delete/article")
    public ResponseEntity<?> deleteUserArticle(@Valid @RequestBody DeleteSavedArticleRequest deleteSavedArticleRequest){
        return articleService.findAndDelete(deleteSavedArticleRequest.getEmail(),deleteSavedArticleRequest.getTitle());
    }
}
