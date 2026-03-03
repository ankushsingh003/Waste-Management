import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import os
import joblib

class PriceForecaster:
    def __init__(self):
        self.model = None
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.model_path = os.path.join(os.path.dirname(__file__), "models", "price_lstm.h5")
        self.scaler_path = os.path.join(os.path.dirname(__file__), "models", "scaler.gz")
        
        if not os.path.exists(os.path.dirname(self.model_path)):
            os.makedirs(os.path.dirname(self.model_path))

    def create_dataset(self, dataset, look_back=1):
        dataX, dataY = [], []
        for i in range(len(dataset)-look_back-1):
            a = dataset[i:(i+look_back), 0]
            dataX.append(a)
            dataY.append(dataset[i + look_back, 0])
        return np.array(dataX), np.array(dataY)

    def train_mock_model(self):
        """Generates synthetic data and trains a quick LSTM for demonstration."""
        print("Generating synthetic price data...")
        # Synthetic data: Sine wave + trend + noise
        t = np.linspace(0, 100, 1000)
        data = np.sin(t) * 10 + 0.5 * t + 50 + np.random.normal(0, 2, 1000)
        df = pd.DataFrame(data, columns=['price'])
        
        dataset = self.scaler.fit_transform(df[['price']].values)
        
        look_back = 10
        trainX, trainY = self.create_dataset(dataset, look_back)
        trainX = np.reshape(trainX, (trainX.shape[0], 1, trainX.shape[1]))
        
        print("Training LSTM model...")
        model = Sequential([
            LSTM(50, input_shape=(1, look_back), return_sequences=True),
            Dropout(0.2),
            LSTM(50),
            Dropout(0.2),
            Dense(1)
        ])
        
        model.compile(loss='mean_squared_error', optimizer='adam')
        model.fit(trainX, trainY, epochs=5, batch_size=1, verbose=1)
        
        self.model = model
        model.save(self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        print(f"Model and Scaler saved to {os.path.dirname(self.model_path)}")

    def load_model(self):
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            self.model = tf.keras.models.load_model(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            return True
        return False

    def predict_next(self, last_sequence):
        """Predicts the next value based on a sequence of last N values."""
        if self.model is None:
            if not self.load_model():
                raise Exception("Model not trained or loaded.")
        
        # Scale and reshape
        last_sequence = np.array(last_sequence).reshape(-1, 1)
        scaled_seq = self.scaler.transform(last_sequence)
        reshaped_seq = np.reshape(scaled_seq, (1, 1, len(last_sequence)))
        
        prediction = self.model.predict(reshaped_seq)
        inverse_prediction = self.scaler.inverse_transform(prediction)
        return float(inverse_prediction[0][0])

if __name__ == "__main__":
    forecaster = PriceForecaster()
    forecaster.train_mock_model()
    # Test prediction
    test_seq = [55, 56, 57, 58, 59, 60, 61, 62, 63, 64]
    pred = forecaster.predict_next(test_seq)
    print(f"Prediction for next step: {pred}")
