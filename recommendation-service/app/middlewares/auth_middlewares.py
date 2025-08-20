from fastapi import Request
from fastapi.responses import JSONResponse
from jose import JWTError,jwt
import os
from dotenv import load_dotenv
load_dotenv() 

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")

async def verificar_token(request: Request, call_next):
    # Permitir acceso sin token solo a rutas específicas (docs, root, etc.)
    rutas_publicas = ["/", "/docs", "/openapi.json", "/recommendations", "/recommendations/{usuario_id}"]
    if request.url.path in rutas_publicas:
        return await call_next(request)

    # Obtener token del header
    auth_header = request.headers.get("Authorization")
    if auth_header is None or not auth_header.startswith("Bearer "):
        return JSONResponse(status_code=401, content={"detail": "Token requerido"})

    token = auth_header[len("Bearer "):]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        request.state.user = payload  # opcional: guardar payload en request
    except JWTError:
        return JSONResponse(status_code=401, content={"detail": "Token inválido o expirado"})

    return await call_next(request)