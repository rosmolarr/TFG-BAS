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
package org.springframework.samples.petclinic.vet;

import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VetService {

	private VetRepository vetRepository;

	@Autowired
	public VetService(VetRepository vetRepository) {
		this.vetRepository = vetRepository;
	}

	@Transactional(readOnly = true)
	public Iterable<Vet> findAll() throws DataAccessException {
		return vetRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Vet findVetById(int id) throws DataAccessException {
		return vetRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vet", "ID", id));
	}

	@Transactional(readOnly = true)
	public Vet findVetByUser(int userId) throws DataAccessException {
		return vetRepository.findVetByUser(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Vet", "User", userId));
	}

	public Optional<Vet> optFindVetByUser(Integer userId) {
		return vetRepository.findVetByUser(userId);
	}

	@Transactional
	public Vet saveVet(Vet vet) throws DataAccessException {
		vetRepository.save(vet);
		return vet;
	}

	@Transactional
	public Vet updateVet(Vet vet, int id) throws DataAccessException {
		Vet toUpdate = findVetById(id);
		BeanUtils.copyProperties(vet, toUpdate, "id", "user");
		vetRepository.save(toUpdate);

		return toUpdate;
	}

	@Transactional
	public void deleteVet(int id) throws DataAccessException {
		Vet toDelete = findVetById(id);
		vetRepository.delete(toDelete);
	}


	public Map<String, Object> getVetsStats() {
		Map<String, Object> res = new HashMap<>();
		Integer countAll = this.vetRepository.countAll();
		Map<String, Integer> vetsByCity = getVetsByCity();

		res.put("totalVets", countAll);
		res.put("vetsByCity", vetsByCity);

		return res;
	}


	private Map<String, Integer> getVetsByCity() {
		Map<String, Integer> unsortedVetsByCity = new HashMap<>();
		this.vetRepository.countVetsGroupedByCity().forEach(m -> {
			String key = m.get("city");
			Integer value = Integer.parseInt(m.get("vets"));
			unsortedVetsByCity.put(key, value);
		});
		return unsortedVetsByCity;
	}

}
