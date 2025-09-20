# File: generate_predictions.py
# FASTER VERSION with parallel processing and a progress bar.

import pandas as pd
from prophet import Prophet
import warnings
from multiprocessing import Pool, cpu_count
from tqdm import tqdm

# Suppress warnings
warnings.filterwarnings('ignore', category=FutureWarning)

# This is the list of parameters to predict.
# Make sure these names EXACTLY match your Excel columns.
parameters_to_predict = [
    'Rainfall(Total)', 
    'Rainfall Recharge', 
    'Groundwater Recharge (ham)',
    'Surface Water Irrigation ',
    'Ground Water Irrigation ',
    'Fresh Total Ground Water Avialable', 
    'Saline Ground Water Avialable'
]

def process_location(location_df):
    """
    This function processes a single location (district).
    It trains a model for each parameter and returns the combined predictions.
    """
    all_forecasts = []
    
    # Get the state and district name from the first row of the group
    state = location_df['State'].iloc[0]
    district = location_df['District'].iloc[0]

    for parameter in parameters_to_predict:
        # Check if the parameter column exists and has data
        if parameter not in location_df or location_df[parameter].isnull().all():
            continue

        history = pd.DataFrame()
        history['ds'] = pd.to_datetime(location_df['year'], format='%Y')
        history['y'] = location_df[parameter].values

        if len(history) < 2:
            continue

        try:
            model = Prophet(yearly_seasonality=False, weekly_seasonality=False, daily_seasonality=False)
            model.fit(history)

            future = model.make_future_dataframe(periods=10, freq='Y')
            forecast = model.predict(future)

            future_predictions = forecast[forecast['ds'].dt.year > history['ds'].dt.year.max()].copy()
            
            future_predictions['State'] = state
            future_predictions['District'] = district
            future_predictions['Parameter'] = parameter
            future_predictions['Year'] = future_predictions['ds'].dt.year
            future_predictions.rename(columns={'yhat': 'Predicted_Value'}, inplace=True)
            
            all_forecasts.append(future_predictions[['State', 'District', 'Year', 'Parameter', 'Predicted_Value']])
        except Exception:
            # If a single parameter fails, we just skip it and continue
            pass
            
    if all_forecasts:
        return pd.concat(all_forecasts, ignore_index=True)
    return None

if __name__ == '__main__':
    print("Starting prediction generation with parallel processing...")

    # --- 1. Load and Prepare Data ---
    try:
        df = pd.read_excel('data_sihh.xlsx')
        print("Data loaded successfully.")
    except FileNotFoundError:
        print("Error: 'your_dataset.xlsx' not found.")
        exit()

    df.drop_duplicates(subset=['State', 'District', 'year'], keep='first', inplace=True)
    print(f"Duplicates removed. Processing {len(df)} unique rows.")

    # Create a list of DataFrames, one for each unique location
    locations = [group for _, group in df.groupby(['State', 'District'])]
    
    print(f"Found {len(locations)} unique locations to process.")
    print(f"Using {cpu_count()} CPU cores to speed up the process.")

    # --- 2. Run Predictions in Parallel ---
    # Create a pool of worker processes
    with Pool(cpu_count()) as pool:
        # Use tqdm to create a progress bar
        results = list(tqdm(pool.imap(process_location, locations), total=len(locations), desc="Forecasting"))

    # --- 3. Save Results ---
    # Filter out any None results from failed locations and combine the rest
    final_predictions_df = pd.concat([res for res in results if res is not None], ignore_index=True)

    if not final_predictions_df.empty:
        final_predictions_df.to_csv('all_predictions.csv', index=False)
        print(f"\nSuccessfully generated and saved {len(final_predictions_df)} predictions to 'all_predictions.csv'")
    else:
        print("\nNo predictions were generated. Please check your data.")