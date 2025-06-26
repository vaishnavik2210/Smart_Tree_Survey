from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil, os, uuid

from services.soil_predictor import predict_soil
from services.plant_identifier import identify_plant
from tree_recommender.tree_recommender import recommend_trees

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict-soil")
async def predict_soil_api(
    file: UploadFile = File(...),
    location_type: str = Form(...)
):
    temp_path = f"temp_{uuid.uuid4().hex}.jpg"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        soil_type = predict_soil(temp_path)
        recommendations = recommend_trees(soil_type.lower(), location_type.lower())
        return {
            "soil_type": soil_type,
            "recommended_trees": recommendations
        }
    finally:
        os.remove(temp_path)

@app.post("/identify-plant")
async def identify_plant_api(file: UploadFile = File(...)):
    temp_path = f"temp_{uuid.uuid4().hex}.jpg"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        name, desc = identify_plant(temp_path)
        return {
            "plant_name": name,
            "description": desc
        }
    finally:
        os.remove(temp_path)
