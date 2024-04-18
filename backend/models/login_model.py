from pydantic import BaseModel

class UserLogin(BaseModel):
    phone: str
    password: str
    level: str