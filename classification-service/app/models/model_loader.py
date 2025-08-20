import os
import tensorflow as tf
load_model = tf.keras.models.load_model

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

modelo_clasificador = load_model(os.path.join(BASE_DIR, "modelo_clasificador.h5"))
modelo_embedding = load_model(os.path.join(BASE_DIR, "modelo_embedding.h5"))