from typing import Optional

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from src.model import load_district_data, load_district_data_temp, load_district_data_pred

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


models = {}
aqi_forecast = {}
avg_temp_forecast = {}
pred = {}

@app.on_event("startup")
async def startup_event() -> None:
    print("startup")
    models["aqi"] = load_district_data()
    models["avg_temp"] = load_district_data_temp()
    models["pred"] = load_district_data_pred()

    for district, model in models['aqi'].items():
        aqi_forecast[district] = model.forecast(12).tolist()

    for district, model in models['avg_temp'].items():
        avg_temp_forecast[district] = model.forecast(92+365)[92:].tolist()

    # for district, csv in models['pred'].items():
    #     pred[district] = [row.Normal_heat_wave_prediction for row in csv]
    

@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    template_name = "home.html"
    return templates.TemplateResponse(
        template_name,
        {
            "request": request
        }
    )


@app.get("/aqi", response_class=JSONResponse)
def aqi_data(request: Request, district: Optional[str] = None):
    if not district:
        return aqi_forecast
    
    return aqi_forecast[district]

@app.get("/avg_temp", response_class=JSONResponse)
def aqi_data(request: Request, district: Optional[str] = None):
    if not district:
        return avg_temp_forecast
    
    return avg_temp_forecast[district]

@app.get("/pred", response_class=JSONResponse)
def aqi_data(request: Request, district: Optional[str] = None):
    if not district:
        return models["pred"]
    
    return models["pred"]


if __name__ == "__main__":
    uvicorn.run("src.__main__:app", reload=True, host="0.0.0.0", port=8080, forwarded_allow_ips="*")