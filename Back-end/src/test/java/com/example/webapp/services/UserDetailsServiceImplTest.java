package com.example.webapp.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.webapp.models.*;
import com.example.webapp.repositories.UserRepository;
import java.util.Optional;
import com.example.webapp.security.UserDetailsImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {UserDetailsServiceImpl.class})
@ExtendWith(SpringExtension.class)
class UserDetailsServiceImplTest {
    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @MockBean
    private UserRepository userRepository;

    /*
    Test 1:
    The method, loadUserByUsername, should find a user,
    given their correct username, in the MySQL database and return a
    UserDetails object containing correct user information
    */
    @Test
    void testLoadUserByUsername() throws UsernameNotFoundException {
        //given
        String username = "testUsername";
        String email = "testEmail@test.com";
        String password = "testPassword";

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);

        Optional<User> optUser = Optional.of(user);
        when(userRepository.findByUsername((String) any())).thenReturn(optUser);

        //when
        UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);

        //then
        assertEquals(username, userDetails.getUsername());
        assertEquals(email, ((UserDetailsImpl) userDetails).getEmail());
        assertEquals(password, userDetails.getPassword());
        verify(userRepository).findByUsername((String) any());
    }

    /*
    Test 2:
    The method, loadUserByUsername, should throw an exception,
    given their incorrect username, and return a string explaining the error
    */
    @Test
    void ifUserNotFoundShouldThrowNotFoundException() throws UsernameNotFoundException {
        //given
        String username = "testUsername";
        when(userRepository.findByUsername(username)).thenThrow(
                new UsernameNotFoundException("User with username: [" + username +  "] Not Found")
        );

        //then
        assertThrows(UsernameNotFoundException.class,
                () -> userDetailsServiceImpl.loadUserByUsername(username));
        verify(userRepository).findByUsername(username);
    }
}

