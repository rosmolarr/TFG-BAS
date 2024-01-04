package org.springframework.samples.petclinic.communication;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommunicationService {
    private CommunicationRepository communicationRepository;

    @Autowired
	public CommunicationService(CommunicationRepository communicationRepository) {
		this.communicationRepository = communicationRepository;
	}

	@Transactional(readOnly = true)
	public List<Communication> findAll() throws DataAccessException {
		
		return (List<Communication>) communicationRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Communication findCommunicationById(int communicationId) throws DataAccessException {
		
		Optional<Communication> communication = communicationRepository.findById(communicationId);
		
		if(communication.isPresent()) {
			return communication.get();
		}else{
			return null;
		}
	}

    @Transactional
	public Communication save(Communication communication) throws DataAccessException {
		communicationRepository.save(communication);
		return communication;
	}

	@Transactional
	public Communication update(Communication communication, int communicationId) throws DataAccessException {
		
		Communication communicationToUpdate = communicationRepository.findById(communicationId).get();
		if (communication.getEntidad() != null){
			BeanUtils.copyProperties(communication, communicationToUpdate, "id");
		}else{
			BeanUtils.copyProperties(communication, communicationToUpdate, "id", "entidad");
		}

		return save(communicationToUpdate);
	}

	@Transactional
	public void delete(int communicationId) throws DataAccessException {
		communicationRepository.deleteById(communicationId);
	}

	@Transactional
	public List<Communication> findCommunicationsByUserId(int userId) throws DataAccessException {
		return communicationRepository.findCommunicationByUserId(userId);
	}
}
