# TFG para el Banco de Alimentos de Sevilla
Este proyecto se centra en el desarrollo de una aplicación web diseñada para optimizar la forma de gestión que se lleva a cabo en la ONG el Banco de Alimentos de
Sevilla. La aplicación ofrece a los administradores la capacidad de coordinar citas, comunicaciones y datos de las beneficiarias de la actividad desarrollada por el banco de
alimentos, mientras que permite a estas últimas enviar consultas y acceder a información relevante, como próximas citas y mensajes dirigidos al personal del banco.

### Requisitos
Los siguientes elementos deben estar instalados en el sistema:
* [Java 17 o mayor](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) *Recordamos que hay que actualizar las variables de entorno, este [vídeo](https://www.youtube.com/watch?v=Zi3nDD7KNEg) puede servir de ayuda
* [Node.js 18 o mayor](https://learn.microsoft.com/es-es/windows/dev-environment/javascript/nodejs-on-windows)
* La línea de comandos de git.
* Tu IDE preferido
  * Eclipse
  * [Spring Tools Suite](https://spring.io/tools) (STS)
  * IntelliJ IDEA 
  * [VS Code](https://code.visualstudio.com) *Recomendamos
  * 
 Para ver que versión teneis instalada podéis usar estos comandos:

```
java --version
node --version
```
<image src="/versiones.png" alt="Versiones instaladas">
  
## Como ejecutar el backend localmente
TFG-BAS es una aplicación de [Spring Boot](https://spring.io/guides/gs/spring-boot) contruida usando [Maven](https://spring.io/guides/gs/maven/). Puedes crear un archivo JAR y ejecutarlo desde la línea de comandos, o puedes ejecutarlo directamente desde Maven usando el plugin de Maven de Spring Boot. Si haces esto, recogerá los cambios que realices en el proyecto de inmediato (los cambios en los archivos fuente de Java también requieren una compilación - la mayoría de la gente usa un IDE para esto). Recomendamos lo segundo, para ello primero utiliza un IDE ( VSCode por ejemplo ), instala los plugins necesarios (Maven for Java, el paquete de Java,..). Clona el proyecto en cualquier carpeta de su ordenador y abrelo en el IDE File -> Import -> Maven -> Existing Maven project:

```
git clone https://github.com/rosmolarr/TFG-BAS.git
cd TFG-BAS
./mvnw package
java -jar target/*.jar
```

Podrás acceder al backend desde aquí: [http://localhost:8080/](http://localhost:8080/swagger-ui/index.html) usando el siguiente comando desde la consola del IDE:

```
./mvnw spring-boot:run
```

## Configuración de la base de datos

El proyecto usa mysql, que puede ser adminitrado a traves de la aplicación dbeaver. Para que funcione, deberás crear una base de datos y construir las tablas. Las tablas podrás encontrarlas en la carpeta: database. Primero deberás ejecutar Tablas.sql, despues Trigger.sql, y por último Datos.sql que creara datos de prueba para la página web.

Cuando tenga su usuario administrador y el nombre de su base de datos (que recomendamos usar "bas" como nombre) deberás añadir sus credenciales en el archivo:

<image src="/bd.png" alt="Usuarios base de datos">

## Para ejecutar el frontend

TFG-BAS está implementado con un frontend en React en la carpeta llamada "frontend". Recomendamos instalar la extensión de React en VSCode, y recordamos que hay que tener instalado node.
Puedes iniciar el servidor de desarrollo para ver el frontend usando el comando (quizás debas usar el comando `npm install` antes de esto):
```
npm start
```
Puedes acceder al frontend a través de esta url [http://localhost:3000](http://localhost:3000)
