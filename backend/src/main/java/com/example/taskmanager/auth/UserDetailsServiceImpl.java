package com.example.taskmanager.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
  private final UserRepository users;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    AppUser u =
        users.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    return User.withUsername(u.getUsername()).password(u.getPasswordHash()).roles("USER").build();
  }
}

