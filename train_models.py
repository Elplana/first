import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import KFold, cross_validate, GridSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, mean_absolute_percentage_error
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor

# Try importing XGBoost & LightGBM
try:
    from xgboost import XGBRegressor
    HAS_XGB = True
except ImportError:
    HAS_XGB = False

try:
    from lightgbm import LGBMRegressor
    HAS_LGBM = True
except ImportError:
    HAS_LGBM = False

import joblib

# Set styles
sns.set_theme(style="whitegrid")
plt.rcParams.update({'font.size': 11, 'figure.autolayout': True})

base_dir = r"c:\Users\Rayan Das\Desktop\laliga"
csv_path = os.path.join(base_dir, "cleaned_player_data.csv")
model_dir = os.path.join(base_dir, "model_results")
os.makedirs(model_dir, exist_ok=True)

df = pd.read_csv(csv_path)
print(f"Loaded cleaned dataset: {df.shape} (rows, cols)")

# Define Features and Target
cat_cols = ['league', 'position']
num_cols = [
    'minutes_played', 'appearances', 'matches_started', 'rating',
    'goals', 'assists', 'expected_goals', 'expected_assists',
    'total_shots', 'shots_on_target', 'tackles', 'interceptions',
    'saves', 'yellow_cards', 'red_cards',
    'goals_per90', 'assists_per90', 'xG_per90', 'xA_per90',
    'total_shots_per90', 'shots_on_target_per90', 'tackles_per90',
    'interceptions_per90', 'saves_per90', 'yellow_cards_per90', 'red_cards_per90'
]

X = df[cat_cols + num_cols].copy()
y_log = df['log_market_value'].values
y_raw = df['market_value'].values

# Preprocessing Pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(drop='first', handle_unknown='ignore'), cat_cols),
        ('num', StandardScaler(), num_cols)
    ]
)

# Candidates definition
models = {
    'Dummy Regressor (Median)': DummyRegressor(strategy='median'),
    'Ridge Regression': Ridge(alpha=10.0),
    'Random Forest': RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1),
    'Extra Trees': ExtraTreesRegressor(n_estimators=100, max_depth=14, random_state=42, n_jobs=-1),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=42)
}

if HAS_XGB:
    models['XGBoost'] = XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=42, n_jobs=-1)

if HAS_LGBM:
    models['LightGBM'] = LGBMRegressor(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=42, verbose=-1, n_jobs=-1)

# 5-Fold Cross Validation Evaluation
kf = KFold(n_splits=5, shuffle=True, random_state=42)

results = []

print("\nRunning 5-Fold Cross Validation across candidate models...")
print("=" * 80)

for name, model in models.items():
    pipe = Pipeline([
        ('prep', preprocessor),
        ('reg', model)
    ])
    
    maes, rmses, r2s, mapes = [], [], [], []
    
    for train_idx, val_idx in kf.split(X, y_log):
        X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
        y_train_log, y_val_log = y_log[train_idx], y_log[val_idx]
        y_val_raw = y_raw[val_idx]
        
        pipe.fit(X_train, y_train_log)
        y_pred_log = pipe.predict(X_val)
        y_pred_raw = np.expm1(y_pred_log)
        # Clip negative predictions to 0
        y_pred_raw = np.clip(y_pred_raw, 0, None)
        
        mae = mean_absolute_error(y_val_raw, y_pred_raw)
        rmse = np.sqrt(mean_squared_error(y_val_raw, y_pred_raw))
        r2 = r2_score(y_val_log, y_pred_log)
        mape = mean_absolute_percentage_error(y_val_raw, y_pred_raw) * 100
        
        maes.append(mae)
        rmses.append(rmse)
        r2s.append(r2)
        mapes.append(mape)
        
    avg_mae = np.mean(maes)
    avg_rmse = np.mean(rmses)
    avg_r2 = np.mean(r2s)
    avg_mape = np.mean(mapes)
    
    results.append({
        'Model': name,
        'MAE (€)': avg_mae,
        'RMSE (€)': avg_rmse,
        'R2 (Log Target)': avg_r2,
        'MAPE (%)': avg_mape
    })
    
    print(f"{name:25s} | MAE: €{avg_mae:11,.0f} | RMSE: €{avg_rmse:11,.0f} | R²: {avg_r2:0.4f} | MAPE: {avg_mape:5.1f}%")

results_df = pd.DataFrame(results).sort_values(by='MAE (€)')
print("\n" + "="*80)
print("MODEL COMPARISON SUMMARY:")
print(results_df.to_string(index=False))

# Save summary table
results_csv_path = os.path.join(model_dir, "model_comparison_results.csv")
results_df.to_csv(results_csv_path, index=False)

# Hyperparameter Tuning on Best Performing Model
best_model_name = results_df.iloc[0]['Model']
print(f"\nPerforming Hyperparameter Tuning for top model: {best_model_name}...")

if 'LightGBM' in best_model_name:
    param_grid = {
        'reg__n_estimators': [100, 200, 300],
        'reg__max_depth': [4, 6, 8],
        'reg__learning_rate': [0.03, 0.08, 0.12],
        'reg__num_leaves': [15, 31, 63]
    }
    base_m = LGBMRegressor(random_state=42, verbose=-1, n_jobs=-1)
elif 'XGBoost' in best_model_name:
    param_grid = {
        'reg__n_estimators': [100, 200, 300],
        'reg__max_depth': [3, 5, 7],
        'reg__learning_rate': [0.03, 0.08, 0.15]
    }
    base_m = XGBRegressor(random_state=42, n_jobs=-1)
elif 'Random Forest' in best_model_name:
    param_grid = {
        'reg__n_estimators': [100, 200, 300],
        'reg__max_depth': [8, 12, 16],
        'reg__min_samples_split': [2, 5]
    }
    base_m = RandomForestRegressor(random_state=42, n_jobs=-1)
elif 'Extra Trees' in best_model_name:
    param_grid = {
        'reg__n_estimators': [100, 200, 300],
        'reg__max_depth': [10, 15, 20],
        'reg__min_samples_split': [2, 5]
    }
    base_m = ExtraTreesRegressor(random_state=42, n_jobs=-1)
else:
    param_grid = {
        'reg__n_estimators': [100, 200],
        'reg__max_depth': [3, 5, 8],
        'reg__learning_rate': [0.05, 0.1]
    }
    base_m = GradientBoostingRegressor(random_state=42)

tune_pipe = Pipeline([
    ('prep', preprocessor),
    ('reg', base_m)
])

grid_search = GridSearchCV(tune_pipe, param_grid, cv=5, scoring='r2', n_jobs=-1)
grid_search.fit(X, y_log)

best_pipeline = grid_search.best_estimator_
print(f"Best Hyperparameters found: {grid_search.best_params_}")

# Fit best pipeline on full dataset
best_pipeline.fit(X, y_log)

# Save best pipeline model
saved_model_path = os.path.join(base_dir, "footballiq_best_model.joblib")
joblib.dump(best_pipeline, saved_model_path)
print(f"\nBest model successfully saved to: {saved_model_path}")

# Plot 1: Model MAE Comparison Chart
plt.figure(figsize=(10, 5))
sns.barplot(data=results_df, x='MAE (€)', y='Model', hue='Model', palette='viridis', legend=False)
plt.title('Model Comparison — Mean Absolute Error (Lower is Better)', fontsize=13, fontweight='bold')
plt.xlabel('MAE (€)')
plt.tight_layout()
p1_path = os.path.join(model_dir, "model_comparison_mae.png")
plt.savefig(p1_path, dpi=300)
plt.close()

# Plot 2: Feature Importances
fitted_reg = best_pipeline.named_steps['reg']
fitted_prep = best_pipeline.named_steps['prep']

# Extract feature names from preprocessor
cat_encoder = fitted_prep.named_transformers_['cat']
cat_feature_names = cat_encoder.get_feature_names_out(cat_cols).tolist()
all_feature_names = cat_feature_names + num_cols

if hasattr(fitted_reg, 'feature_importances_'):
    importances = fitted_reg.feature_importances_
    feat_imp = pd.DataFrame({
        'Feature': all_feature_names,
        'Importance': importances
    }).sort_values(by='Importance', ascending=False)
    
    plt.figure(figsize=(10, 8))
    sns.barplot(data=feat_imp.head(20), x='Importance', y='Feature', hue='Feature', palette='mako', legend=False)
    plt.title(f'Top 20 Feature Importances ({best_model_name})', fontsize=13, fontweight='bold')
    plt.xlabel('Feature Importance')
    plt.tight_layout()
    p2_path = os.path.join(model_dir, "feature_importance.png")
    plt.savefig(p2_path, dpi=300)
    plt.close()
    
    print("\nTop 10 Most Important Features:")
    print(feat_imp.head(10).to_string(index=False))

# Plot 3: Predicted vs Actual Scatter Plot
y_full_pred_log = best_pipeline.predict(X)
y_full_pred_raw = np.expm1(y_full_pred_log)

plt.figure(figsize=(8, 8))
plt.scatter(y_raw / 1e6, y_full_pred_raw / 1e6, alpha=0.5, color='#1f77b4', edgecolors='none', s=30)
plt.plot([0, 220], [0, 220], 'r--', label='Perfect Prediction Line')
plt.title('Predicted vs Actual Market Values (€ Millions)', fontsize=13, fontweight='bold')
plt.xlabel('Actual Market Value (€M)')
plt.ylabel('Predicted Market Value (€M)')
plt.legend()
plt.tight_layout()
p3_path = os.path.join(model_dir, "predicted_vs_actual.png")
plt.savefig(p3_path, dpi=300)
plt.close()

print("\nModel training, hyperparameter tuning, plot generation, and persistence completed successfully!")
