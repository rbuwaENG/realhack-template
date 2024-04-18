from pydantic import BaseModel

class EditUser(BaseModel):
    name: str
    email:str
    password: str
    phone: str
    address:str