from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
import os
import subprocess

app = Flask(__name__)

# Ensure model is trained if not exists
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
if not os.path.exists(model_path):
    print("Model not found. Training model now...")
    import train_model

# Load the trained model
with open(model_path, 'rb') as f:
    model = pickle.load(f)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        area = float(data.get('area', 0))
        bedrooms = int(data.get('bedrooms', 0))
        bathrooms = int(data.get('bathrooms', 0))
        age = int(data.get('age', 0))

        # Input validation
        if area <= 0 or bedrooms <= 0 or bathrooms <= 0 or age < 0:
            return jsonify({'error': 'Invalid input values. Must be positive numbers (age can be 0).'})

        # Predict
        features = np.array([[area, bedrooms, bathrooms, age]])
        prediction = model.predict(features)[0]

        return jsonify({'predicted_price': round(prediction, 2)})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
