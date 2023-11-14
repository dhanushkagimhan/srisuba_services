# sirisuba_serives

## create docker progres db

`docker-compose up --build`

### detached mode

`docker-compose up -d`

### stop the containers

`docker-compose down`

### remove the volumes

`docker-compose down --volumes`

## prisma

### after schema updation run this command for db updation

`npx prisma migrate dev`

### for the prisma client updation

`npx prisma generate`
