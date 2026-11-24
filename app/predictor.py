import os
import pandas as pd
import numpy as np
from app.models import PlayerPredictionRequest, PlayerPredictionResponse


class MarketValuePredictor:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.pipeline = None
        self.use_numpy_fallback = False
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                import joblib
                self.pipeline = joblib.load(self.model_path)
                print(f"Loaded ML pipeline model from: {self.model_path}")
                return
            except Exception as e:
                print(f"Joblib/sklearn load bypass active ({e}). Initializing pure NumPy engine...")

        self._init_numpy_engine()

    def _init_numpy_engine(self):
        base_dir = os.path.dirname(os.path.dirname(__file__))
        csv_path = os.path.join(base_dir, "cleaned_player_data.csv")
        if not os.path.exists(csv_path):
            csv_path = "cleaned_player_data.csv"

        df = pd.read_csv(csv_path)
        self.cat_cols = ['league', 'position']
        self.num_cols = [
            'minutes_played', 'appearances', 'matches_started', 'rating',
            'goals', 'assists', 'expected_goals', 'expected_assists',
            'total_shots', 'shots_on_target', 'tackles', 'interceptions',
            'saves', 'yellow_cards', 'red_cards',
            'goals_per90', 'assists_per90', 'xG_per90', 'xA_per90',
            'total_shots_per90', 'shots_on_target_per90', 'tackles_per90',
            'interceptions_per90', 'saves_per90', 'yellow_cards_per90', 'red_cards_per90'
        ]

        X_df = pd.get_dummies(df[self.cat_cols + self.num_cols], columns=self.cat_cols, drop_first=True)
        self.feature_columns = list(X_df.columns)

        X = X_df.values.astype(float)
        y = df['log_market_value'].values

        self.means = X.mean(axis=0)
        self.stds = X.std(axis=0)
        self.stds[self.stds == 0] = 1.0

        X_scaled = (X - self.means) / self.stds
        X_bias = np.hstack([np.ones((len(X), 1)), X_scaled])

        lambda_reg = 10.0
        I = np.eye(X_bias.shape[1])
        I[0, 0] = 0.0
        self.w = np.linalg.solve(X_bias.T @ X_bias + lambda_reg * I, X_bias.T @ y)
        self.use_numpy_fallback = True
        self.pipeline = "Pure_NumPy_Ridge_Pipeline"
        print("Pure NumPy market value predictor initialized successfully!")

    def predict(self, request: PlayerPredictionRequest) -> PlayerPredictionResponse:
        input_data = {
            'league': request.league,
            'position': request.position,
            'minutes_played': request.minutes_played,
            'appearances': request.appearances,
            'matches_started': request.matches_started,
            'rating': request.rating,
            'goals': request.goals,
            'assists': request.assists,
            'expected_goals': request.expected_goals,
            'expected_assists': request.expected_assists,
            'total_shots': request.total_shots,
            'shots_on_target': request.shots_on_target,
            'tackles': request.tackles,
            'interceptions': request.interceptions,
            'saves': request.saves,
            'yellow_cards': request.yellow_cards,
            'red_cards': request.red_cards,
            'goals_per90': request.goals_per90,
            'assists_per90': request.assists_per90,
            'xG_per90': request.xG_per90,
            'xA_per90': request.xA_per90,
            'total_shots_per90': request.total_shots_per90,
            'shots_on_target_per90': request.shots_on_target_per90,
            'tackles_per90': request.tackles_per90,
            'interceptions_per90': request.interceptions_per90,
            'saves_per90': request.saves_per90,
            'yellow_cards_per90': request.yellow_cards_per90,
            'red_cards_per90': request.red_cards_per90,
        }

        if not self.use_numpy_fallback:
            input_df = pd.DataFrame([input_data])
            log_pred = self.pipeline.predict(input_df)[0]
        else:
            # Reconstruct dummy encoding matching feature_columns
            row = {col: input_data[col] for col in self.num_cols}
            for cat_c in self.cat_cols:
                val = input_data[cat_c]
                dummy_col = f"{cat_c}_{val}"
                if dummy_col in self.feature_columns:
                    row[dummy_col] = 1.0

            x_vec = np.zeros(len(self.feature_columns))
            for i, col_name in enumerate(self.feature_columns):
                x_vec[i] = row.get(col_name, 0.0)

            x_scaled = (x_vec - self.means) / self.stds
            x_bias = np.insert(x_scaled, 0, 1.0)
            log_pred = float(np.dot(x_bias, self.w))

        raw_pred = float(np.expm1(log_pred))
        raw_pred = max(0.0, raw_pred)

        formatted_val = f"€{raw_pred:,.2f}"

        return PlayerPredictionResponse(
            predicted_market_value_euros=round(raw_pred, 2),
            formatted_market_value=formatted_val,
            status="success"
        )

