
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from location import router as location_router
from predict import router as predict_router
from llm import router as llm_router
from match import router as match_router

app = FastAPI()

# Allow all CORS (any origin, method, header)
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"]
)

app.include_router(location_router)
app.include_router(predict_router)
app.include_router(llm_router)
app.include_router(match_router)
