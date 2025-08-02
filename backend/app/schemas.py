import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime.datetime

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoanBase(BaseModel):
    amount: float
    interest_rate: float = 0.2
    term_months: int


class LoanCreate(LoanBase):
    pass


class LoanOut(LoanBase):
    id: int
    status: str
    created_at: datetime.datetime

    class Config:
        orm_mode = True