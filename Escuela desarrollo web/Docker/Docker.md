

### Que es docker?

Docker es un gestor de contenedores que nos permiten compartir nuestro código encalpasualdo en un caja a otros developer que después en sus propias maquinas podrán ejecutar nuestro código .

Nace con el propósito de solucionar que en muchos casos el codigo que nos funciona en local no le es igual de eficiente a nuestros compañeros u otras personas que quieran usar el codigo . 



#### Contenedores vs maquinas virtuales


![[Pasted image 20240925190135.png]]


## **Máquinas Virtuales (VM):**

1. **Aislamiento:** Las VMs proporcionan un aislamiento completo, ya que ejecutan un sistema operativo completo independiente del host.
2. **Recurso Intensivo:** Las VMs pueden consumir más recursos, porque cada una tiene su propio sistema operativo y una cantidad significativa de recursos dedicados.
3. **Arranque Más Lento:** El arranque de una VM es más lento, puesto que implica iniciar un sistema operativo completo.
4. **Hypervisor:** Las VMs se ejecutan en un hipervisor, que gestiona y asigna recursos para cada máquina virtual.

## **Contenedores:**

1. **Aislamiento Ligero:** Los contenedores comparten el mismo kernel del sistema operativo del host, lo que proporciona un aislamiento más ligero.
2. **Eficiencia de Recursos:** Los contenedores son más eficientes en términos de recursos, ya que comparten el mismo sistema operativo y solo incluyen las bibliotecas y dependencias necesarias.
3. **Arranque Rápido:** Los contenedores tienen un arranque rápido, por el hecho de que no requieren iniciar un sistema operativo completo.
4. **Docker, Containerd, etc.:** Docker es una de las tecnologías de contenedores más populares, y otras implementaciones incluyen containerd, rkt, etc.