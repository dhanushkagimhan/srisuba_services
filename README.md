# sirisuba_services

## create docker progres db

`docker-compose up --build`

### detached mode

`docker-compose up -d`

### stop the containers

`docker-compose down`

### remove the volumes

`docker-compose down --volumes`

## prisma

### after schema updating run this command for db updating

`npx prisma migrate dev --skip-seed`

### for the prisma client updating

`npx prisma generate`

### seed database

`npx prisma db seed`

### Reset database

`npx prisma migrate reset --skip-seed`
