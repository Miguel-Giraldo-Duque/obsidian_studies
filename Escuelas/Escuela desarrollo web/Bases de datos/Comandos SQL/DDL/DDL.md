

### Que son?

Son todos los comandos que afectan directamente a la creación, modificar o eliminación de diccionarios  de datos  :

1. **Vistas**: Consultas comunes almacenadas en la base de datos
2. **Esquemas o bases de datos** : Nuestro contenedor principal de tablas y lugar de almacén de informacion 
3.  **Tablas** : Nuestras [[Entidades]] y sus [[Tipos de datos]]  
#### Comandos de creación

1. **Manejo de vistas:**

Creación de vistas 
```sql 
-- CREATE VIEW +  nombre vista +  la informacion que queremos guardar 
	CREATE VIEW clients_on_madrid AS SELECT * FROM people_genetic  
```

Eliminar vistas
```sql 
-- DROP VIEW + nombre de la vista 
	DROP VIEW clients_on_madrid 
```


2. **Manejo de esquemas:**

Creación de bases de datos 
```sql 
-- CREATE DATABASE(o SCHEMA) + nombre base de datos
	CREATE DATABASE test
```

Eliminar bases de datos
```sql 
-- DROP DATABASE + nombre de la vista 
	DROP DATABASE clients_on_madrid 
```

3. **Manejo de tablas:**

Creación de bases de datos 
```sql 
-- CREATE TABLE + campos Y tipos de valores
	CREATE TABLE test_table (
	id_test INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre VARCHAR(255) NULL,
    descripcion TEXT NULL,
	dinero  BIGINT NULL,
	fecha_creacion  TIMESTAMP NOT NULL 
-- Check funciona asi toma un tipo valor y check(variable + la condicional) 
especialidad VARCHAR(100) NOT NULL CHECK (especialidad IN ('Cirujano', 'Ayudante', 'Neurologo', 'Recesita'))
)

-- check 
```

Eliminar tablas
```sql 
-- DROP TABLE + nombre de la tabla 
	DROP TABLE test_table 
```


Edición tablas
```sql 
-- ALTER TABLE + nombre de la tabla + ADD COLUMN + nueva columna y su tipo   

ALTER TABLE	test_table ADD COLUMN registros INT;
	
-- ALTER TABLE + nombre de la tabla  +  DROP COLUMN + columna a eliminar 	
ALTER TABLE	test_table DROP COLUMN registros;

-- ALTER TABLE + nombre de la tabla  +  CHANGE COLUMN + columna antigua + columna nueva por editar 	
ALTER TABLE test_table CHANGE COLUMN old_name new_name VARCHAR(100) NOT NULL;

```




