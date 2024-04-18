from fastapi import FastAPI, HTTPException, Depends, Response
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
from fastapi import File, UploadFile

from models.login_model import UserLogin
from models.register_model import UserRegister
from models.editUser_model import EditUser
from models.deleteUser_model import DeleteUser

app = FastAPI()

# Enable CORS allowing all origins and methods
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "realhack5"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_WEEKS = 2

# pass123 for localhost
# pass1234 for AWS RDS
connection = mysql.connector.connect(user="root", password="pass123", host="localhost", port="3306", database="test")

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

async def update_user(name, email, password, phone, address):
    cursor = connection.cursor()
    try:
        # Use placeholders in the query and pass values as a tuple to cursor.execute()
        query = "UPDATE users SET `name` = %s, `email` = %s, `password` = %s, `address` = %s WHERE `phone` = %s"
        cursor.execute(query, (name, email, password, address, phone))
        connection.commit()  # Commit the transaction
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()  # Close the cursor

async def delete_user(phone):
    cursor = connection.cursor()
    try:
        # Use placeholders in the query and pass values as a tuple to cursor.execute()
        query = "DELETE FROM users WHERE phone = %s"
        cursor.execute(query, (phone,))
        connection.commit()  # Commit the transaction
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()  # Close the cursor

async def read_user_by_phone_and_level(phone, level):
    cursor = connection.cursor()
    try:
        # Use parameterized query to prevent SQL injection
        query = "SELECT * FROM users WHERE phone = %s AND level = %s"
        cursor.execute(query, (phone, level))
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

async def get_user(phone: str, level: str):
    user = await read_user_by_phone_and_level(phone, level)
    return user    # return a dictionary

async def authenticate_user(phone: str, password: str, level: str):
    user = await get_user(phone, level)
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
    user = await get_user(phone, "user")
    if user is None:
        raise credentials_exception
    #print(user)
    return user

async def get_current_admin(token: str = Depends(oauth2_scheme)):
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
    user = await get_user(phone, "admin")
    if user is None:
        raise credentials_exception
    #print(user)
    return user


@app.get("/health")
async def health():
    return {"backend is running"}

# first time login and it returns token
@app.post("/token")
async def login_for_access_token(user_login: UserLogin):
    user = await authenticate_user(user_login.phone, user_login.password, user_login.level)
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

# login using token stored in browser for user level
@app.get("/login/user")
async def login_using_token_user(current_user = Depends(get_current_user)):
    return current_user

# login using token stored in browser for admin level
@app.get("/login/admin")
async def login_using_token_admin(current_user = Depends(get_current_admin)):
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

@app.get("/getUsers")
async def get_users():
    users = await read_users()
    return users

@app.post("/editUser")
async def editUser(user: EditUser):
    try:
       pwd_hash = get_password_hash(user.password)
       await update_user(
           name=user.name, 
           email=user.email,
           password=pwd_hash,
           phone=user.phone,
           address=user.address,
        )
       
       return {"message": "User updated successfully"}
    except Exception as err:
        print(f"Error: {err}")
        return {"message": "Failed to update user"}, status.HTTP_400_BAD_REQUEST
    
@app.post("/deleteUser")
async def deleteUser(user: DeleteUser):
    try:
       await delete_user( 
           phone=user.phone,
        )
       
       return {"message": "User deleted successfully"}
    except Exception as err:
        print(f"Error: {err}")
        return {"message": "Failed to delete user"}, status.HTTP_400_BAD_REQUEST
