package com.example.webapp.services;

import com.example.webapp.models.User;
import com.example.webapp.payloads.response.MessageRes;
import com.example.webapp.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ContextConfiguration(classes = {UserService.class})
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @MockBean
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;
    private UserService userService;

    @Mock
    private PasswordEncoder encoder;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, encoder);
    }

    @Test
    void testGetAllUsers() {
        //given
        User user = new User();
        user.setUsername("testUsername");
        user.setEmail("testEmail@test.com");
        user.setPassword("testPassword");

        User user2 = new User();
        user.setUsername("testUsername2");
        user.setEmail("testEmail2@test.com");
        user.setPassword("testPassword2");

        ArrayList<User> userList = new ArrayList<>();
        userList.add(user);
        userList.add(user2);
        when(userRepository.findAll()).thenReturn(userList);
        //when
        List<User> actualUsers = userService.getUsers();
        //then
        assertSame(userList, actualUsers);
        verify(userRepository).findAll();
    }

    @Test
    public void givenCorrectDetailsCanChangeEmail() {
        //given
        String currEmail = "testEmail@test.com";
        String newEmail = "newTestEmail@test.com";

        User user = new User();
        user.setUsername("testUsername");
        user.setEmail("testEmail@test.com");
        user.setPassword("testPassword");

        //when
        when(userRepository.existsByEmail(currEmail)).thenReturn(true);
        when(userRepository.findByEmail(currEmail)).thenReturn(user);
        userService.changeEmail(currEmail, newEmail);
        user.setEmail(newEmail);

        //then
        ArgumentCaptor<User> userArgumentCaptor =
                ArgumentCaptor.forClass(User.class);

        verify(userRepository).save(userArgumentCaptor.capture());

        User capturedUser = userArgumentCaptor.getValue();

        assertThat(capturedUser).isEqualTo(user);
    }

    @Test
    public void givenIncorrectEmailShouldReturnError() {
        //given
        String currEmail = "testEmail@test.com";
        String newEmail = "newTestEmail@test.com";

        User user = new User();
        user.setUsername("testUsername");
        user.setEmail(currEmail);
        user.setPassword("testPassword");

        //when
        when(userRepository.existsByEmail(currEmail)).thenReturn(false);
        ResponseEntity<MessageRes> result = userService.changeEmail(currEmail, newEmail);

        //then
        assertThat(result.getBody().getMessage()).isEqualTo("Could not find user with email: " + currEmail);
    }

    @Test
    public void givenTheSameEmailShouldReturnError() {
        //given
        String currEmail = "testEmail@test.com";
        String newEmail = "testEmail@test.com";

        User user = new User();
        user.setUsername("testUsername");
        user.setEmail(currEmail);
        user.setPassword("testPassword");

        //when
        when(userRepository.existsByEmail(currEmail)).thenReturn(true);
        when(userRepository.findByEmail(currEmail)).thenReturn(user);
        ResponseEntity<MessageRes> result = userService.changeEmail(currEmail, newEmail);

        //then
        assertThat(result.getBody().getMessage()).isEqualTo("Your Email is already: " + currEmail + ". Enter a different email to change the current one.");
    }

    @Test
    public void ifNewEmailAlreadyExistsShouldReturnError() {
        //given
        String currEmail = "testEmail@test.com";
        String newEmail = "newTestEmail@test.com";

        User user = new User();
        user.setUsername("testUsername");
        user.setEmail(currEmail);
        user.setPassword("testPassword");

        //when
        when(userRepository.existsByEmail(currEmail)).thenReturn(true);
        when(userRepository.findByEmail(currEmail)).thenReturn(user);
        when(userRepository.existsByEmail(newEmail)).thenReturn(true);
        ResponseEntity<MessageRes> result = userService.changeEmail(currEmail, newEmail);

        //then
        assertThat(result.getBody().getMessage()).isEqualTo("This email is already in use");
    }

    @Test
    public void canChangePassword() {
        String currPassword = "testPassword";
        String newPassword = "newTestPassword";
        String email = "testEmail@test.com";

        User user = new User();
        user.setUsername("testUsername");
        user.setEmail(email);
        user.setPassword(encoder.encode(currPassword));

        when(userRepository.existsByEmail(email)).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(user);
        when(encoder.matches(currPassword, user.getPassword())).thenReturn(true);

        ResponseEntity<MessageRes> result = userService.changePassword(currPassword, newPassword, email);

        assertThat(result.getBody().getMessage()).isEqualTo("Password changed successfully");
    }

    @Test
    public void givenTheSamePasswordShouldReturnError() {
        String currPassword = "testPassword";
        String newPassword = "testPassword";
        String email = "testEmail@test.com";

        User user = new User();
        user.setUsername("testUsername");
        user.setEmail(email);
        user.setPassword(encoder.encode(currPassword));

        when(userRepository.existsByEmail(email)).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(user);
        when(encoder.matches(currPassword, user.getPassword())).thenReturn(true);
        when(encoder.matches(newPassword, user.getPassword())).thenReturn(true);

        ResponseEntity<MessageRes> result = userService.changePassword(currPassword, newPassword, email);

        assertThat(result.getBody().getMessage()).isEqualTo("Please choose a password that is different to your current password");
    }

    @Test
    public void givenIncorrectPasswordShouldReturnError() {
        String currPassword = "testPassword";
        String newPassword = "newTestPassword";
        String email = "testEmail@test.com";

        User user = new User();
        user.setUsername("testUsername");
        user.setEmail(email);
        user.setPassword(encoder.encode("myTestPassword"));

        when(userRepository.existsByEmail(email)).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(user);
        when(encoder.matches(currPassword, user.getPassword())).thenReturn(false);

        ResponseEntity<MessageRes> result = userService.changePassword(currPassword, newPassword, email);

        assertThat(result.getBody().getMessage()).isEqualTo("Incorrect password");
    }

    @Test
    public void givenIncorrectEmailShouldReturnNotFoundError() {
        String currPassword = "testPassword";
        String newPassword = "newTestPassword";
        String email = "testEmail@test.com";

        User user = new User();
        user.setUsername("testUsername");
        user.setEmail("userEmail@gmail.com");
        user.setPassword(encoder.encode(currPassword));

        when(userRepository.existsByEmail(email)).thenReturn(false);

        ResponseEntity<MessageRes> result = userService.changePassword(currPassword, newPassword, email);

        assertThat(result.getBody().getMessage()).isEqualTo("Could not find user with email: " + email);
    }
}