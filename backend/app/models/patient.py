from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime, func
class Base(DeclarativeBase): pass
class Patient(Base):
    __tablename__ = 'patients'
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    gender: Mapped[str] = mapped_column(String(30), nullable=True)
    created_at: Mapped[str] = mapped_column(DateTime, server_default=func.now())
