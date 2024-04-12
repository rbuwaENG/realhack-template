run your own MySQL DB server

run inside frontend:  

```
npm install   # install dependency
npm run start  # start website
```
run frontend in docker:

docker build -t realhack-frontend-dev .
docker run --name realhack-frontend-dev -p 3000:3000 realhack-frontend-dev

run backend in docker:

docker build -t realhack-backend .
docker run --name realhack-backend -p 8000:8000 realhack-backend

