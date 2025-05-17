from fastapi import APIRouter


router = APIRouter(
    tags=["Root"]
)

"""Application main root"""
@router.get("/")
def root():
    """Root endpoint"""
    return {"msg": "Hello World"}