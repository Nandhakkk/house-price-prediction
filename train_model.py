import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle
import os

# Create a small house-price dataset
data = {
    'area': [1000, 1500, 2000, 2500, 3000, 1200, 1800, 2200, 2800, 3500],
    'bedrooms': [2, 3, 3, 4, 4, 2, 3, 4, 4, 5],
    'bathrooms': [1, 2, 2, 3, 3, 1, 2, 2, 3, 4],
    'age': [10, 5, 2, 1, 15, 20, 12, 8, 5, 3],
    'price': [150000, 250000, 350000, 450000, 550000, 140000, 280000, 380000, 500000, 650000]
}

df = pd.DataFrame(data)

# Features and Target
X = df[['area', 'bedrooms', 'bathrooms', 'age']]
y = df['price']

# Train Linear Regression model
model = LinearRegression()
model.fit(X, y)

# Save the trained model
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
with open(model_path, 'wb') as f:
    pickle.dump(model, f)

print(f"Model trained and saved to {model_path}")
