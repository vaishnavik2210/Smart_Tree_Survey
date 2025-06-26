import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

model = load_model("soil_prediction/soil_model.h5")
class_names = ['alluvial', 'black', 'clay', 'red']

def predict_soil(soil_image_path):
    img = image.load_img(soil_image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions, axis=1)[0]
    return class_names[predicted_class]
