package com.example.webapp.models;


import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long article_id;

    @NotBlank
    private String title;

    @NotBlank
    private String url;

    public Article(){

    }

    public Article(String title, String url){
        this.title=title;
        this.url=url;
    }

    public Long getArticle_id() {
        return article_id;
    }

    public void setArticle_id(Long article_id) {
        this.article_id = article_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
