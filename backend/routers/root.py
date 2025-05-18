from fastapi import APIRouter


router = APIRouter(
    tags=["Root"]
)

@router.get("/")
def root():
    """Root endpoint"""
    return {"msg": "Hello World"}