from sqlalchemy import text

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine

from app.api.auth import router as auth_router
from app.api.complaints import router as complaints_router
from app.api.followups import router as followups_router
from app.api.svi import router as svi_router
from app.api.users import router as users_router


app = FastAPI(
    title="NHAA Integrated Support Portal API",
    description="Backend API for the NHAA Victim Support Portal",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "https://localhost",
        "capacitor://localhost",

        "http://localhost:5173",
        "http://127.0.0.1:5173",

        "http://localhost:5174",
        "http://127.0.0.1:5174",

        "http://localhost:5175",
        "http://127.0.0.1:5175",

        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API ROUTES
# ============================================================

app.include_router(auth_router)
app.include_router(complaints_router)
app.include_router(followups_router)
app.include_router(svi_router)
app.include_router(users_router)


# ============================================================
# HEALTH
# ============================================================

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "ok",
        "service": "NHAA Victim Support Portal API",
        "version": "1.0.0",
    }


@app.get("/api/v1/health/db")
def database_health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "status": "ok",
        "database": "connected",
    }