from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import base64

from dip_engine import process_image
from database import add_scan, get_scans, add_user, get_user_by_email, verify_password

app = FastAPI(title="DIP QR Scanner API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins since Vite might change ports
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserAuth(BaseModel):
    email: str
    password: str

@app.post("/register")
def register_user(user: UserAuth):
    success = add_user(user.email, user.password)
    if not success:
        raise HTTPException(status_code=400, detail="Email already registered")
    return {"success": True, "message": "User registered successfully"}

@app.post("/login")
def login_user(user: UserAuth):
    db_user = get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"success": True, "message": "Login successful"}

@app.get("/")
def read_root():
    return {"message": "DIP QR Scanner API is running"}

@app.post("/scan/upload")
async def scan_upload(file: UploadFile = File(...)):
    """Handles image file uploads."""
    image_bytes = await file.read()
    result = process_image(image_bytes)
    
    if result.get("success") and result["scans"]:
        # Save first detected scan to history
        first_scan = result["scans"][0]
        add_scan(first_scan["data"], first_scan["type"])
        
    return result

@app.post("/scan/live")
async def scan_live(base64_image: str = Form(...)):
    """Handles base64 encoded images from webcam feed."""
    try:
        # Remove data URI scheme prefix if present (e.g., "data:image/jpeg;base64,")
        if "," in base64_image:
            base64_image = base64_image.split(",")[1]
            
        image_bytes = base64.b64decode(base64_image)
        result = process_image(image_bytes)
        
        if result.get("success") and result["scans"]:
            first_scan = result["scans"][0]
            add_scan(first_scan["data"], first_scan["type"])
            
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/history")
def get_history(limit: int = 50):
    """Retrieves scan history."""
    scans = get_scans(limit)
    return {"success": True, "history": scans}
