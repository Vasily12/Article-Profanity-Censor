package com.example.webapp.repositories;

import com.example.webapp.models.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
public class UserRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }

    /*
    Test 1:
    User repository should find a user,
    given their email, in the MySQL database and return that user
    */
    @Test
    void itShouldFindUserByEmail(){
        //given
        User user = new User(
                "testUsername",
                "testEmail@gmail.com",
                "testPassword"
        );
        userRepository.save(user);
        //when
        User foundUser = userRepository.findByEmail(user.getEmail());
        //then
        assertThat(foundUser).isEqualTo(user);
    }

    /*
    Test 2:
    User repository should check if a user exists,
    given their email, in the MySQL database and return a boolean
    */
    @Test
    void itShouldCheckIfUserExistsByEmail() {
        //given
        User user = new User(
                "testUsername",
                "testEmail@gmail.com",
                "testPassword"
        );
        userRepository.save(user);
        //when
        Boolean exists = userRepository.existsByEmail(user.getEmail());
        //then
        assertThat(exists).isTrue();
    }

    /*
    Test 3:
    User repository should check if a user exists,
    given their username, in the MySQL database and return a boolean
    */
    @Test
    void itShouldCheckIfUserExistsByUsername() {
        //given
        User user = new User(
                "testUsername",
                "testEmail@gmail.com",
                "testPassword"
        );
        userRepository.save(user);
        //when
        Boolean exists = userRepository.existsByUsername(user.getUsername());
        //then
        assertThat(exists).isTrue();
    }
}
