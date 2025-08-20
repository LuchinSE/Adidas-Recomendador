import os
from dotenv import load_dotenv
import uvicorn

# Carga variables de entorno desde el archivo .env
load_dotenv()

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8001))

    # Ejecuta uvicorn con la ruta del módulo y app
    uvicorn.run("app.main:app", host=host, port=port, reload=True)