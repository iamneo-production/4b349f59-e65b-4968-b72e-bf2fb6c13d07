import pandas as pd

def combine_aqi_aaq(aqi_df: pd.DataFrame, aaq_df: pd.DataFrame, district: str) -> pd.DataFrame:
    # get dates from month and year
    aqi_df['date'] = pd.to_datetime(aqi_df['month'] + aqi_df['year'].astype(str), format='%b%Y')
    aaq_df['date'] = pd.to_datetime(aaq_df['month'] + aaq_df['year'].astype(str), format='%b%Y')

    # converting aqi to numeric
    aqi_df['aqi'] = pd.to_numeric(aqi_df["aqi"], errors='coerce')

    # dropping NH3 and PM2.5 from aaq_df
    aaq_df.drop(columns=['NH3', 'PM2.5'], inplace=True)

    # filling na values
    aqi_df.fillna(method="ffill", inplace=True)
    
    aaq_df['SO2'].fillna(aaq_df.groupby(by=["district", "month"])['SO2'].transform(
        'mean').fillna(aaq_df.SO2.mean()), inplace=True)
    aaq_df['NOx'].fillna(aaq_df.groupby(by=["district", "month"])['NOx'].transform(
        'mean').fillna(aaq_df.NOx.mean()), inplace=True)
    aaq_df['PM10'].fillna(aaq_df.groupby(by=["district", "month"])['PM10'].transform(
        'mean').fillna(aaq_df.PM10.mean()), inplace=True)
    
    # merging the dfs
    df = pd.merge(aqi_df, aaq_df, on=['district', 'date', 'month', 'year'])

    # selecting the district
    df = df[df['district'] == district]

    # dropping unnecessary columns
    df.drop(columns=['month', 'year'], inplace=True)

    return df




