DELIMITER $$
CREATE TRIGGER check_entity_type
BEFORE INSERT ON personas
FOR EACH ROW
BEGIN
    DECLARE entidad_tipo ENUM('COMUNIDAD_RELIGIOSA', 'CENTROS_DE_INSERCION', 'CASAS_DE_AGOGIDAS', 'COMEDOR_SOCIAL', 'PARROQUIA', 'CENTRO_ASISTENCIAL', 'GUARDERIA', 'APOYO_ADICCIONES', 'APOYO_A_MENORES_Y_ADOLESCENTES');
    DECLARE entidad_descripcion ENUM('CONSUMO', 'REPARTO');

    -- Obtener el tipo de la entidad asociada a la persona tutelada
    SELECT tipo, descripcion INTO entidad_tipo, entidad_descripcion
    FROM entidades
    WHERE id = NEW.entidad_id;

    -- Verificar si la entidad es de tipo 'REPARTO'
    IF entidad_descripcion != 'REPARTO' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La entidad asociada debe ser de tipo REPARTO.';
    END IF;
END$$
DELIMITER ;