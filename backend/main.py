from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


# -------------------------
# MODELS
# -------------------------
class PackageRequest(BaseModel):
    package_name: str


# -------------------------
# BASIC ROUTES
# -------------------------
@app.get("/")
def home():
    return {"message": "Backend is running successfully!"}


@app.post("/install")
def install_package(data: PackageRequest):
    # Dummy implementation
    return {
        "status": "success",
        "action": "install",
        "package": data.package_name
    }


@app.post("/remove")
def remove_package(data: PackageRequest):
    # Dummy implementation
    return {
        "status": "success",
        "action": "remove",
        "package": data.package_name
    }


@app.post("/update")
def update_package(data: PackageRequest):
    # Dummy implementation
    return {
        "status": "success",
        "action": "update",
        "package": data.package_name
    }
