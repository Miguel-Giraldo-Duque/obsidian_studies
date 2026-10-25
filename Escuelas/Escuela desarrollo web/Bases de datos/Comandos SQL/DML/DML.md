## ¿Qué son los comandos DML?

Los comandos DML (Data Manipulation Language) son instrucciones SQL que manipulan **datos** directamente en:

- **Tablas**: Donde se almacenan los datos estructurados
    
- **Vistas**: Consultas almacenadas que representan datos de tablas
    
- **Esquemas/Bases de datos**: Contenedores de objetos de base de datos
    

## 🔥 Comandos DML Esenciales

### 1. INSERT (Insertar datos)

sql

Copy

Download

-- Insertar valores específicos
INSERT INTO table_name (col1, col2) 
VALUES (val1, val2);

-- Insertar desde otra tabla
INSERT INTO table1 (col1, col2)
SELECT colA, colB FROM table2;

### 2. SELECT (Consultar datos)

sql

Copy

Download

-- Consulta básica
SELECT col1, col2 FROM table_name;

-- Con condiciones WHERE
SELECT * FROM table_name 
WHERE condition;

-- Con ordenamiento
SELECT * FROM table_name
ORDER BY col1 DESC;

-- Con límite
SELECT * FROM table_name
LIMIT 10;

### 3. UPDATE (Actualizar datos)

sql

Copy

Download

-- Actualización simple le decimos que tabla + que valor actualizar el nuevo valor y una condicional para mantenr efectos paractiso
UPDATE table_name
SET col1 = val1, col2 = val2
WHERE condition;

-- Actualización con JOIN
UPDATE table1 t1
JOIN table2 t2 ON t1.id = t2.id
SET t1.col1 = t2.colA
WHERE t2.colB = 'valor';

### 4. DELETE (Eliminar datos)

sql

Copy

Download

-- Eliminar con condición
DELETE FROM table_name
WHERE condition;

-- Eliminar todos los datos (¡Cuidado!)
DELETE FROM table_name;

-- Eliminar más seguro con límite
DELETE FROM table_name
WHERE condition
LIMIT 100;

## 🎯 Ejemplos Prácticos DML

### Insertar datos en una tabla

sql

Copy

Download

INSERT INTO clientes (nombre, email, fecha_registro)
VALUES ('Juan Pérez', 'juan@example.com', NOW());

### Consulta con múltiples condiciones

sql

Copy

Download

SELECT nombre, email FROM clientes
WHERE ciudad = 'Madrid'
  AND fecha_registro > '2023-01-01'
ORDER BY nombre ASC;

### Actualización condicional

sql

Copy

Download

UPDATE productos
SET precio = precio * 1.10  -- Aumento del 10%
WHERE categoria = 'Electrónica';

### Eliminación segura

sql

Copy

Download

DELETE FROM pedidos
WHERE estado = 'cancelado'
  AND fecha < '2022-01-01';

## 💡 Consejos Clave

1. **WHERE es crucial** en UPDATE y DELETE para evitar cambios masivos accidentales
    
2. **Usa TRANSACCIONES** cuando modifiques datos importantes:
    
    sql
    
    Copy
    
    Download
    
    START TRANSACTION;
    UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
    UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;
    COMMIT;  -- O ROLLBACK si hay error
    
3. **Prueba con SELECT** antes de hacer UPDATE o DELETE
    
4. **BACKUP** antes de operaciones masivas



### Guardado 

Usar start_transation cuando hacer una operación arriesgada  y rollback para devolver al estado original  , y commit para establecer los cambios
