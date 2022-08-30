package com.example.webapp.services;

import com.example.webapp.models.Article;
import com.example.webapp.models.User;
import com.example.webapp.payloads.response.MessageRes;
import com.example.webapp.repositories.ArticleRepository;
import com.example.webapp.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public ArticleService(ArticleRepository articleRepository, UserRepository userRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    public ResponseEntity<MessageRes> save(String email, String title, String url){
        if(userRepository.existsByEmail(email)){
            User user = userRepository.findByEmail(email);
            List<Article> articles = user.getArticles();
            Article article = new Article(title,url);
            articleRepository.save(article);
            articles.add(article);
            user.setArticles(articles);
            userRepository.save(user);
            return ResponseEntity.ok().body(new MessageRes("Article saved"));
        }
        else {
            return ResponseEntity.badRequest().body(new MessageRes("You need to be signed in to access this feature"));
        }
    }

    public ResponseEntity<?> getArticles(String email){
        if(userRepository.existsByEmail(email)) {
            User user = userRepository.findByEmail(email);
            if(user.getArticles().isEmpty()){
                return ResponseEntity.badRequest().body(new MessageRes("No saved articles found"));
            }
            else {
                return ResponseEntity.ok(user.getArticles());
            }
        }
        else{
            return ResponseEntity.badRequest().body(new MessageRes("User not found"));
        }
    }

    public ResponseEntity<MessageRes> findAndDelete(String email, String title){
        User user = userRepository.findByEmail(email);
        List<Article> articles = user.getArticles();
        for (int i = 0; i < articles.size(); i++) {
            Article article = articles.get(i);
            if(article.getTitle().equals(title)){
                articles.remove(article);
                articleRepository.delete(article);
                user.setArticles(articles);
                userRepository.save(user);
            }
        }
        return ResponseEntity.ok().body(new MessageRes("Article Deleted"));
    }
}
