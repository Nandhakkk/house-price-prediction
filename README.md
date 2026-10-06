# House Price Prediction

A simple Machine Learning web application to predict house prices based on Area, Bedrooms, Bathrooms, and Age. 
Built using Python, Flask, scikit-learn, HTML, CSS, and JavaScript.

## Setup Instructions

1. Ensure you have Python installed.
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Open your browser and navigate to `http://localhost:5000`

## Project Structure

- `train_model.py`: Script to generate synthetic data and train the Linear Regression model.
- `app.py`: Flask web application.
- `templates/index.html`: The frontend user interface.
- `static/`: Contains CSS and JavaScript files for styling and interactivity.
