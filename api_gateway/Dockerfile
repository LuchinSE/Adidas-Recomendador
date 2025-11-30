# Imagen base ligera con JDK 17
FROM eclipse-temurin:21-jdk-jammy

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el jar generado por Maven al contenedor
COPY target/*.jar app.jar

# Puerto donde corre tu API Gateway (ajusta si es otro)
EXPOSE 8080

# Ejecutar el jar al iniciar el contenedor
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
