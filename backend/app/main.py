from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import (
    close_mongo_connection,
    connect_to_mongo,
)
from .routes.customers import router as customers_router
from .routes.deals import router as deals_router
from .routes.leads import router as leads_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()

    yield

    await close_mongo_connection()


app = FastAPI(
    title="CRM Dashboard API",
    version="1.0.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    leads_router,
    prefix="/api",
)

app.include_router(
    customers_router,
    prefix="/api",
)

app.include_router(
    deals_router,
    prefix="/api",
)