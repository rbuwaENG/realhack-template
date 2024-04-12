# main.py

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import status
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import mysql.connector

from models.login_model import UserLogin
from models.register_model import UserRegister

app = FastAPI()

# Enable CORS allowing all origins and methods
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_WEEKS = 2

connection = mysql.connector.connect(user="root", password="pass123", host="172.17.0.2", port="3306", database="test")

async def read_users():
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        if users:
            columns = [column[0] for column in cursor.description]
            users = [dict(zip(columns, row)) for row in users]     
            return users
        else:
            return None
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()  # Close the cursor

async def read_user_by_phone(phone):
    cursor = connection.cursor()
    try:
        # Use parameterized query to prevent SQL injection
        query = "SELECT * FROM users WHERE phone = %s"
        cursor.execute(query, (phone,))
        user = cursor.fetchone()
        
        if user:
            columns = [column[0] for column in cursor.description]
            user = dict(zip(columns, user))
            return user
        else:
            return None
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()  # Close the cursor


async def create_user(name, email, password, phone, address, level):
    cursor = connection.cursor()
    try:
        # Use placeholders in the query and pass values as a tuple to cursor.execute()
        query = "INSERT INTO users (`name`, `email`, `password`, `phone`, `address`, `level`) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (name, email, password, phone, address, level))
        connection.commit()  # Commit the transaction
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()  # Close the cursor
    

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    try:
        isMatching = pwd_context.verify(plain_password, hashed_password)
        return isMatching
    except Exception as err:
        print(f"Error: {err}")
        return False

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(phone: str):
    user = await read_user_by_phone(phone)
    return user    # return a dictionary

async def authenticate_user(phone: str, password: str):
    user = await get_user(phone)
    print(user)
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        #print(payload)
        phone: str = payload.get("sub")
        if phone is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await get_user(phone)
    if user is None:
        raise credentials_exception
    #print(user)
    return user

@app.post("/token")
async def login_for_access_token(user_login: UserLogin):
    user = await authenticate_user(user_login.phone, user_login.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(weeks=ACCESS_TOKEN_EXPIRE_WEEKS)
    access_token = create_access_token(
        data={"sub": user["phone"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "expires_in": access_token_expires, "token_type": "bearer"}

@app.get("/login")
async def login_using_token(current_user = Depends(get_current_user)):
    return current_user

@app.post("/register")
async def register(user_register: UserRegister):
    try:
       pwd_hash = get_password_hash(user_register.password)
       await create_user(
           name=user_register.name, 
           email=user_register.email,
           password=pwd_hash,
           phone=user_register.phone,
           address=user_register.address,
           level=user_register.level
        )
       
       return {"message": "User registered successfully"}
    except Exception as err:
        print(f"Error: {err}")
        return {"message": "Failed to register user"}, status.HTTP_400_BAD_REQUEST
        