/*
 * Copyright 2002-2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springframework.samples.bas.user;

import java.util.Optional;

import jakarta.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.bas.entidad.Entidad;
import org.springframework.samples.bas.entidad.EntidadService;
import org.springframework.samples.bas.exceptions.ResourceNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

	private UserRepository userRepository;

	private EntidadService entidadService;

	private PasswordEncoder encoder;

	@Autowired
	public UserService(UserRepository userRepository, EntidadService entidadService, PasswordEncoder encoder) {
		this.userRepository = userRepository;
		this.entidadService = entidadService;
		this.encoder = encoder;
	}

	@Transactional
	public User saveUser(User user) throws DataAccessException {
		userRepository.save(user);
		return user;
	}

	@Transactional(readOnly = true)
	public User findUser(String username) {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
	}

	@Transactional(readOnly = true)
	public User findUser(Integer id) {
		return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
	}

	@Transactional(readOnly = true)
	public Entidad findEntidadByUser(String username) {
		return userRepository.findEntidadByUser(username)
				.orElseThrow(() -> new ResourceNotFoundException("entidad", "username", username));
	}

	@Transactional(readOnly = true)
	public Entidad findEntidadByUser(int id) {
		return userRepository.findEntidadByUser(id)
		.orElseThrow(() -> new ResourceNotFoundException("entidad", "ID", id));
	}

	@Transactional(readOnly = true)
	public User findCurrentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null)
			throw new ResourceNotFoundException("Nobody authenticated!");
		else
			return userRepository.findByUsername(auth.getName())
					.orElseThrow(() -> new ResourceNotFoundException("User", "Username", auth.getName()));
	}

	public Boolean existsUser(String username) {
		return userRepository.existsByUsername(username);
	}

	@Transactional(readOnly = true)
	public Iterable<User> findAll() {
		return userRepository.findAll();
	}

	public Iterable<User> findAllByAuthority(String auth) {
		return userRepository.findAllByAuthority(auth);
	}

	@Transactional
	public User updateUser(@Valid User user, Integer idToUpdate) {
		User toUpdate = findUser(idToUpdate);

		if (!user.getPassword().equals(toUpdate.getPassword())) {
			// La contraseña ha cambiado, así que la hasheamos antes de actualizar el usuario
			user.setPassword(encoder.encode(user.getPassword()));
		}
		BeanUtils.copyProperties(user, toUpdate, "id");
		userRepository.save(toUpdate);
		return toUpdate;
	}

	@Transactional
	public void deleteUser(Integer id) {
		User toDelete = findUser(id);
		deleteRelations(id, toDelete.getAuthority().getAuthority());
		this.userRepository.delete(toDelete);
	}

	private void deleteRelations(Integer id, String auth) {
		switch (auth) {
		case "ENTIDAD":
			Optional<Entidad> entidad = userRepository.findEntidadByUser(id);
			if (entidad.isPresent()) {
				entidadService.deleteById(entidad.get().getId());
			}
			break;
		default:
			// The only relations that have user is Entidad
			break;
		}

	}

}
