from pathlib import Path

from statsmodels.tsa.arima.model import ARIMAResultsWrapper
from statsmodels.iolib.smpickle import load_pickle


DISTRICTS = (
    "Khammam",
    "Nizamabad",
    "Adilabad",
    "Karimnagar",
    "Warangal"
)


def _unpickle_model(filename: str):
    model: ARIMAResultsWrapper = load_pickle(fname=filename)

    return model


def load_district_data():
    data = {}
    pickles_path = Path("src", "model", "pickles")
    for district in DISTRICTS:
        d_path = pickles_path.joinpath(district)
        
        if d_path.exists():
            data[district] = _unpickle_model(d_path.absolute())

    return data