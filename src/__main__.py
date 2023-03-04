from typing import Optional

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from src.model import load_district_data

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


models = {}
aqi_forecast = {}

@app.on_event("startup")
async def startup_event() -> None:
    print("startup")
    models["aqi"] = load_district_data()

    for district, model in models['aqi'].items():
        aqi_forecast[district] = model.forecast(12).tolist()


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


if __name__ == "__main__":
    uvicorn.run("src.__main__:app", reload=True, host="0.0.0.0", port=8080, forwarded_allow_ips="*")