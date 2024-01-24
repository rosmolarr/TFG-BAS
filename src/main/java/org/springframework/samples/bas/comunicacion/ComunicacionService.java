package org.springframework.samples.bas.comunicacion;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ComunicacionService {
    private ComunicacionRepository comunicacionRepository;

    @Autowired
	public ComunicacionService(ComunicacionRepository comunicacionRepository) {
		this.comunicacionRepository = comunicacionRepository;
	}

	@Transactional(readOnly = true)
	public List<Comunicacion> findAll() throws DataAccessException {
		
		return (List<Comunicacion>) comunicacionRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Comunicacion findComunicacionById(int comunicacionId) throws DataAccessException {
		
		Optional<Comunicacion> comunicacion = comunicacionRepository.findById(comunicacionId);
		
		if(comunicacion.isPresent()) {
			return comunicacion.get();
		}else{
			return null;
		}
	}

    @Transactional
	public Comunicacion save(Comunicacion comunicacion) throws DataAccessException {
		comunicacionRepository.save(comunicacion);
		return comunicacion;
	}

	@Transactional
	public Comunicacion update(Comunicacion comunicacion, int comunicacionId) throws DataAccessException {
		
		Comunicacion comunicacionToUpdate = comunicacionRepository.findById(comunicacionId).get();
		if (comunicacion.getEntidad() != null){
			BeanUtils.copyProperties(comunicacion, comunicacionToUpdate, "id");
		}else{
			BeanUtils.copyProperties(comunicacion, comunicacionToUpdate, "id", "entidad");
		}

		return save(comunicacionToUpdate);
	}

	@Transactional
	public void delete(int comunicacionId) throws DataAccessException {
		comunicacionRepository.deleteById(comunicacionId);
	}

	@Transactional
	public List<Comunicacion> findComunicacionByEntidadId(int userId) throws DataAccessException {
		return comunicacionRepository.findComunicacionByEntidadId(userId);
	}
}
