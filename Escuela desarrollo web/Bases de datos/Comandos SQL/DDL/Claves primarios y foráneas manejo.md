

### Como se usan?

Las claves foreaneas se usan para relacionar dos tablas y las primarias para dar idnependencia a cada [[Entidades]], para poder usarlos en los comandos [[DDL]] podemos

```sql

create table posts (
	id_post int not null auto_increment,
    titulo varchar(150),
    contenido text,
    estatus char(8) check(estatus in ("activo", "inactivo")),
    usuarios_id int ,
    categorias_id int ,

--Podemos definir la primary key señalandolo al final del codigo primary key + nombre campo 
    primary key(id_post),

-- Para agregar una clave foranea usa foring key (campo) referencia a tabla(clave) 
    foreign key (usuarios_id) references usuarios(id)
    on delete no action
	on update cascade,
	foreign key (categorias_id) references categorias(id_categoria)
    on delete cascade
	on update cascade
)

``` 

#### Como se usa "on" y sus casos  acciones de referencia?
Los usuamos cuando en una de entidades fuertes como podria por ejemplo usuario es digamos actualizado/eliminado le pdoemos indicar al la tabla que la referencia que debe hacer siendo :
1. **ON DELETE**: Especifica qué hacer cuando se elimina una fila referenciada
    
2. **ON UPDATE**: Especifica qué hacer cuando se actualiza una fila referenciada

3. **SET NULL**
    
    - Establece NULL en la columna de clave foránea
        
    - Requiere que la columna permita valores NULL

4. **SET DEFAULT**
    
    - Establece el valor por defecto de la columna
        
    - Requiere que la columna tenga un valor por defecto definido