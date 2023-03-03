from typing import Union

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


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
def aqi_data(request: Request):
    data = {
        "a": []
    }


if __name__ == "__main__":
    uvicorn.run("src.__main__:app", reload=True)