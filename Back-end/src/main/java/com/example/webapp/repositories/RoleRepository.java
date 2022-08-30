package com.example.webapp.repositories;

import com.example.webapp.models.ERole;
import com.example.webapp.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {
    Optional<Role> findByRole(ERole role);
}
