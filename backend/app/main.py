import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import diagnosis, symptoms, recommendation, skincare

load_dotenv()

app = FastAPI(title='DermaDiagnosis API', version='1.0.0')

# Frontend berjalan di Vite (localhost:5173).
# Untuk development lokal, izinkan semua origin agar tidak kena error CORS
# saat browser memakai localhost/127.0.0.1 yang berbeda.
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(diagnosis.router)
app.include_router(symptoms.router)
app.include_router(recommendation.router)
app.include_router(skincare.router)

@app.get('/')
def root():
    return {
        'name': 'DermaDiagnosis API',
        'status': 'ok',
        'database': 'local-json',
        'supabase': 'removed',
    }

@app.get('/health')
def health():
    return {'status': 'healthy'}
