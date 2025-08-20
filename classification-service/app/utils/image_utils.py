from fastapi import UploadFile
import numpy as np
import tensorflow as tf
from PIL import Image
import io

def preprocess_image_bytes(file: UploadFile):
    image_bytes = file.file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("L")
    image = image.resize((28, 28))
    image_array = np.array(image) / 255.0
    image_tensor = tf.convert_to_tensor(image_array, dtype=tf.float32)
    image_tensor = tf.reshape(image_tensor, (1, 28, 28, 1))
    return image_tensor

def preprocess_image_desde_bytes(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("L")
    image = image.resize((28, 28))
    image_array = np.array(image) / 255.0
    image_tensor = tf.convert_to_tensor(image_array, dtype=tf.float32)
    image_tensor = tf.reshape(image_tensor, (1, 28, 28, 1))
    return image_tensor