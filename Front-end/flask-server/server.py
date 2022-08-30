from crypt import methods
from sre_parse import Tokenizer
from flask import Flask, request
from bs4 import BeautifulSoup
import requests
import re
from better_profanity import profanity
from flask_cors import CORS, cross_origin
from transformers import pipeline, AutoTokenizer, AutoModelForMaskedLM
import tensorflow as tf

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/article-parser", methods=["POST"])
@cross_origin()
def article_parser():

    json = request.get_json('body')
    url = json.get('url')

    webpage_res = requests.get(url)
    webpage = webpage_res.content
    soup = BeautifulSoup(webpage, "html.parser")

    title = soup.find("h1")

    web_texts = soup.find_all(["h5", "p"])

    str_uncensored = []
    str_censored = []
    real_censored_str = []

    total_word_num = 0
    sentence_len_total = 0
    sentence_num = 0

    for text in web_texts:
        if len(text.get_text()) < 40:
            text
        else:
            str_censored.append(profanity.censor(text.get_text(), "*"))
            str_uncensored.append(text.get_text())
            real_censored_str.append(profanity.censor(text.get_text(), "*"))
            sentences = text.get_text().split('.')
            sentence_num += len(sentences)
            for sentence in sentences:
                sentence_len_total += len(sentence.split())
            word_list = text.get_text().split()
            total_word_num += len(word_list)

    avg_sentence_len = sentence_len_total/sentence_num

    num_of_profane_words = 0

    for text in str_censored:
        num_of_profane_words += text.count("****")

    profanity_scale = (num_of_profane_words/total_word_num)*100

    #Initialises pre-trained Bert tokenizer and model  
    tokenizer = AutoTokenizer.from_pretrained("bert-base-cased")
    model = AutoModelForMaskedLM.from_pretrained("bert-base-cased")  

    #Initialises the NLP pipeline 
    nlp = pipeline("fill-mask",model=model,tokenizer=tokenizer)

    #Parsed article text lists 
    censored_text = str_censored
    nlp_censored_text = str_censored

    #Splits the article text into paragraphs 
    for text in range(len(censored_text)):
        #Method for paragraphs containing only 1 profane word
        if censored_text[text].count("****")==1:
            #Masks the profane word found within the paragraph
            masked_text= censored_text[text].replace("****","[MASK]")
            #Pipeline computes the top predicted word
            pred_word = nlp(masked_text, top_k=1)
            for item in pred_word:
                #Replaces the profane word with the predicted word
                nlp_censored_text[text]=nlp_censored_text[text].replace("****", item['token_str'])

        #Method for paragraphs containing multiple profane words
        if censored_text[text].count("****")>1:
            masked_text = censored_text[text]
            while masked_text.count("****")!=0:
                #Masks profane words found in the paragraph 1 by 1
                masked_text = masked_text.replace("****","[MASK]",1)
                #Pipeline computes the top predicted word
                pred_word = nlp(masked_text, top_k=1)
                for item in pred_word:
                    #Removes the mask placed earlier 
                    masked_text = masked_text.replace("[MASK]", item['token_str'])
                    #Replaces the profane word with the predicted word
                    nlp_censored_text[text]=nlp_censored_text[text].replace("****", item['token_str'],1)

    return {
        "article":{
            "title": title.get_text(),
            "censored_text": real_censored_str,
            "uncensored_text": str_uncensored,
            "nlp_censored_text": nlp_censored_text,
            "scale": round(profanity_scale,2),
            "word_len": total_word_num,
            "profane_words_len": num_of_profane_words,
            "avg_sentence_len": round(avg_sentence_len,2)
        }
    }

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/compare_articles", methods=["POST"])
@cross_origin()
def compare_articles():

    json = request.get_json('body')
    url1 = json.get('url1')
    url2 = json.get('url2')

    webpage_res1 = requests.get(url1)
    webpage_res2 = requests.get(url2)

    soup1 = BeautifulSoup(webpage_res1.content, "html.parser")
    soup2 = BeautifulSoup(webpage_res2.content, "html.parser")

    title1 = soup1.find("h1")
    title2 = soup2.find("h1")

    web1_texts = soup1.find_all(["h5", "p"])
    web2_texts = soup2.find_all(["h5", "p"])

    str1_censored = []
    str2_censored = []
    word_length1 = 0
    sentence_len_total1 = 0
    sentence_num1 = 0
    word_length2 = 0
    sentence_len_total2 = 0
    sentence_num2 = 0

    for text in web1_texts:
        if len(text.get_text()) < 40:
            text
        else:
            str1_censored.append(profanity.censor(text.get_text(), "*"))
            sentences = text.get_text().split('.')
            sentence_num1 += len(sentences)
            for sentence in sentences:
                sentence_len_total1 += len(sentence.split())
            word_list1 = text.get_text().split()
            word_length1 += len(word_list1)

    for text in web2_texts:
        if len(text.get_text()) < 40:
            text
        else:
            str2_censored.append(profanity.censor(text.get_text(), "*"))
            sentences = text.get_text().split('.')
            sentence_num2 += len(sentences)
            for sentence in sentences:
                sentence_len_total2 += len(sentence.split())
            word_list2 = text.get_text().split()
            word_length2 += len(word_list2)

    avg_sentence_len1 = sentence_len_total1/sentence_num1
    avg_sentence_len2 = sentence_len_total2/sentence_num2

    profane_num1 = 0;
    profane_num2 = 0;
    
    for text in str1_censored:
        profane_num1 += text.count("****")

    for text in str2_censored:
        profane_num2 += text.count("****")

    profanity_scale1 = (profane_num1/word_length1)*100
    profanity_scale2 = (profane_num2/word_length2)*100

    return {
        "article1": 
        {
            "title": title1.get_text(),
            "word_len": word_length1,
            "avg_sentence_len": round(avg_sentence_len1,2),
            "profane_words_num": profane_num1,
            "scale": round(profanity_scale1,2)            
        },
        "article2":
        {
            "title": title2.get_text(),
            "word_len": word_length2,
            "avg_sentence_len": round(avg_sentence_len2,2),
            "profane_words_num": profane_num2,
            "scale": round(profanity_scale2,2) 
        }
    }

if __name__ == "__main__":
    app.run(debug=True)
