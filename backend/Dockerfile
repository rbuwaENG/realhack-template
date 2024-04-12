FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip --timeout=3000 install -r requirements.txt
COPY . .
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000", "--reload"] 