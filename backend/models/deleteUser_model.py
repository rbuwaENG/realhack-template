from pydantic import BaseModel

class DeleteUser(BaseModel):
    phone: str