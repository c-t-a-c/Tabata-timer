from typing import Optional
from pydantic import BaseModel, PositiveInt

class Program(BaseModel):
    """Parse and validate json data"""
    id: Optional[PositiveInt] = None
    title: str
    prepare: PositiveInt
    work: PositiveInt
    rest: PositiveInt
    cycles: PositiveInt
    sets: PositiveInt
    restbetweensets: PositiveInt
