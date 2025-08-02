from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/loans", tags=["loans"])


@router.post("/", response_model=schemas.LoanOut)
def create_loan(loan_in: schemas.LoanCreate, db: Session = Depends(get_db)):
    loan = models.Loan(**loan_in.dict())
    db.add(loan)
    db.commit()
    db.refresh(loan)
    return loan


@router.get("/{loan_id}", response_model=schemas.LoanOut)
def read_loan(loan_id: int, db: Session = Depends(get_db)):
    loan = db.query(models.Loan).filter(models.Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan