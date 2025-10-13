import bcrypt
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from app.services.jwt_service import crear_token
import os

router = APIRouter()

USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:8081/api/usuarios/activos")

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(data: LoginRequest):
    print(f"LOGIN ATTEMPT: {data.email}")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(USER_SERVICE_URL)
            response.raise_for_status()
            usuarios = response.json()
            print(f"📊 Users found: {len(usuarios)}")
        except Exception as e:
            print(f"❌ User service error: {e}")
            raise HTTPException(status_code=500, detail="Error conectando al servicio de usuarios")
        
    usuario = next((u for u in usuarios if u["correo"] == data.email), None)
    if not usuario:
        print(f"❌ User not found: {data.email}")
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    print(f"✅ User found: {usuario['correo']}")
    print(f"🔑 Password in DB: {usuario['contrasena']}")
    print(f"📏 Password length: {len(usuario['contrasena'])}")
    print(f"🔍 Is bcrypt format: {usuario['contrasena'].startswith('$2')}")

    try:
        print("🔐 Verifying password with bcrypt...")
        print(f"Input password: '{data.password}'")
        
        # Convertir a bytes
        password_bytes = data.password.encode('utf-8')
        stored_password = usuario["contrasena"]
        
        # Verificar si el hash almacenado es válido para bcrypt
        if not stored_password.startswith('$2'):
            print("❌ Stored password doesn't look like a bcrypt hash")
            raise HTTPException(status_code=500, detail="Formato de contraseña inválido")
        
        # Verificar la contraseña
        if bcrypt.checkpw(password_bytes, stored_password.encode('utf-8')):
            print("✅ Password verified successfully!")
            
            token_data = {
                "sub": usuario["correo"],
                "id": usuario["id"],
                "nombre": usuario.get("nombre", "")
            }
            
            token = crear_token(token_data)
            print("✅ JWT token generated successfully")
            
            response_data = {
                "access_token": token, 
                "token_type": "bearer",
                "user": {
                    "id": usuario["id"],
                    "email": usuario["correo"],
                    "nombre": usuario.get("nombre", "Usuario")
                }
            }
            
            print(f"🎉 LOGIN SUCCESS: {usuario['correo']}")
            return response_data
        else:
            print("❌ Password incorrect - bcrypt verification failed")
            print(f"Hash comparison failed for user: {usuario['correo']}")
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 Error during verification: {str(e)}")
        import traceback
        print(f"🔍 Stack trace: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Error en la verificación de contraseña")
    
@router.get("/debug/users")
async def debug_users():
    """Endpoint para debug - ver todos los usuarios"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(USER_SERVICE_URL)
            usuarios = response.json()
            
            debug_info = []
            for usuario in usuarios:
                debug_info.append({
                    "id": usuario["id"],
                    "correo": usuario["correo"],
                    "nombre": usuario.get("nombre", ""),
                    "contrasena_length": len(usuario["contrasena"]),
                    "contrasena_preview": usuario["contrasena"][:30] + "...",
                    "is_bcrypt": usuario["contrasena"].startswith("$2")
                })
            
            return {"users": debug_info}
        except Exception as e:
            return {"error": str(e)}

@router.get("/verify-token")
async def verify_token(token: str):
    """Verificar si un token JWT es válido"""
    from app.services.jwt_service import verificar_token
    
    payload = verificar_token(token)
    if payload:
        return {"valid": True, "payload": payload}
    else:
        return {"valid": False, "message": "Token inválido o expirado"}
    

# app/routes/auth_routes.py - Agrega este endpoint temporal para debugging
@router.post("/debug/password-check")
async def debug_password_check(email: str, password: str):
    """Endpoint temporal para debug de contraseñas"""
    async with httpx.AsyncClient() as client:
        response = await client.get(USER_SERVICE_URL)
        usuarios = response.json()
    
    usuario = next((u for u in usuarios if u["correo"] == email), None)
    if not usuario:
        return {"error": "Usuario no encontrado"}
    
    stored_hash = usuario["contrasena"]
    password_bytes = password.encode('utf-8')
    
    debug_info = {
        "user_found": True,
        "email": usuario["correo"],
        "stored_hash": stored_hash,
        "stored_hash_length": len(stored_hash),
        "is_bcrypt_format": stored_hash.startswith('$2'),
        "password_provided": password,
        "verification_attempted": True
    }
    
    try:
        is_valid = bcrypt.checkpw(password_bytes, stored_hash.encode('utf-8'))
        debug_info["password_valid"] = is_valid
    except Exception as e:
        debug_info["password_valid"] = False
        debug_info["error"] = str(e)
    
    return debug_info 