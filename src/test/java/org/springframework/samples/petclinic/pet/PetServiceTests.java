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
package org.springframework.samples.petclinic.pet;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Map;

import jakarta.transaction.Transactional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.pet.exceptions.DuplicatedPetNameException;
import org.springframework.samples.petclinic.util.EntityUtils;
import org.springframework.samples.petclinic.vet.VetRestController;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.samples.petclinic.vet.VetService;

//@DataJpaTest(includeFilters = @ComponentScan.Filter(Service.class))
@SpringBootTest
@AutoConfigureTestDatabase
class PetServiceTests {
	@Autowired
	protected PetService petService;

	@Autowired
	protected OwnerService ownerService;

	@Autowired
	protected VetService vetService;

	@Test
	void shouldFindPetWithCorrectId() {
		Pet pet7 = this.petService.findPetById(7);
		assertThat(pet7.getName()).startsWith("Samantha");
		assertEquals("Jean", pet7.getOwner().getFirstName());
	}

	@Test
	void shouldNotFindPetWithInorrectId() {
		assertThrows(ResourceNotFoundException.class, () -> this.petService.findPetById(700));
	}

	@Test
	void shouldFindAllPets() {
		Collection<Pet> pets = this.petService.findAll();

		Pet pet1 = EntityUtils.getById(pets, Pet.class, 1);
		assertEquals("Leo", pet1.getName());
		Pet pet4 = EntityUtils.getById(pets, Pet.class, 4);
		assertEquals("Jewel", pet4.getName());
	}

	@Test
	void shouldFindAllPetsByUserId() {
		Collection<Pet> pets = this.petService.findAllPetsByUserId(4);

		Pet pet1 = EntityUtils.getById(pets, Pet.class, 1);
		assertEquals("Leo", pet1.getName());
	}

	@Test
	void shouldFindAllPetsByOwnerId() {
		Collection<Pet> pets = this.petService.findAllPetsByOwnerId(1);

		Pet pet1 = EntityUtils.getById(pets, Pet.class, 1);
		assertEquals("Leo", pet1.getName());
	}

	@Test
	@Transactional
	void shouldInsertPetIntoDatabaseAndGenerateId() {
		Owner owner6 = this.ownerService.findOwnerById(6);
		int initialCount = petService.findAllPetsByOwnerId(owner6.getId()).size();

		Pet pet = new Pet();
		pet.setName("bowser");
		pet.setBirthDate(LocalDate.now());
		pet.setOwner(owner6);
		this.petService.savePet(pet);

		int finalCount = petService.findAllPetsByOwnerId(owner6.getId()).size();

		assertEquals(initialCount + 1, finalCount);
		assertNotNull(pet.getId());
	}

	@Test
	@Transactional
	void shouldThrowExceptionInsertingPetsWithTheSameName() {
		Owner owner6 = this.ownerService.findOwnerById(6);
		Pet pet = new Pet();
		pet.setName("wario");
		pet.setBirthDate(LocalDate.now());
		pet.setOwner(owner6);
		petService.savePet(pet);

		Pet anotherPetWithTheSameName = new Pet();
		anotherPetWithTheSameName.setName("wario");
		anotherPetWithTheSameName.setBirthDate(LocalDate.now().minusWeeks(2));
		anotherPetWithTheSameName.setOwner(owner6);
		assertThrows(DuplicatedPetNameException.class, () -> petService.savePet(anotherPetWithTheSameName));
	}

	@Test
	@Transactional
	void shouldUpdatePet() {
		Pet pet7 = this.petService.findPetById(7);
		String oldName = pet7.getName();

		String newName = oldName + "X";
		pet7.setName(newName);
		this.petService.updatePet(pet7, pet7.getId());

		pet7 = this.petService.findPetById(7);
		assertEquals(newName, pet7.getName());
	}

	@Test
	@Transactional
	void shouldCheckLimitForBasic() {
		Owner owner = this.ownerService.findOwnerById(8);
		assertEquals(true, this.petService.underLimit(owner));
		createPet("wario", owner);
		assertEquals(false, this.petService.underLimit(owner));
	}

	@Test
	@Transactional
	void shouldCheckLimitForGold() {
		Owner owner = this.ownerService.findOwnerById(4);
		assertEquals(true, this.petService.underLimit(owner));
		createPet("wario", owner);
		createPet("wario2", owner);
		createPet("wario3", owner);
		assertEquals(false, this.petService.underLimit(owner));
	}

	@Test
	@Transactional
	void shouldCheckLimitForPlatinum() {
		Owner owner = this.ownerService.findOwnerById(1);
		assertEquals(true, this.petService.underLimit(owner));
		createPet("wario", owner);
		createPet("wario2", owner);
		createPet("wario3", owner);
		createPet("wario4", owner);
		createPet("wario5", owner);
		createPet("wario6", owner);
		createPet("wario7", owner);
		createPet("wario8", owner);
		createPet("wario9", owner);
		createPet("wario10", owner);
		assertEquals(false, this.petService.underLimit(owner));
	}

	private void createPet(String name, Owner owner) {
		Pet pet = new Pet();
		pet.setName(name);
		pet.setBirthDate(LocalDate.now());
		pet.setOwner(owner);
		petService.savePet(pet);
	}

	@SuppressWarnings("unchecked")
	@Test
	@Transactional
	void shouldReturnStatsForAdmin() {
		Map<String, Object> stats = this.petService.getPetsStats();
		assertTrue(stats.containsKey("totalPets"));
		assertEquals(((Collection<Pet>) this.petService.findAll()).size(), stats.get("totalPets"));
		assertTrue(stats.containsKey("avgPetsByOwner"));
		assertNotEquals(0, stats.get("avgPetsByOwner"));
	}

}
