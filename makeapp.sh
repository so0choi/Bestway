docker rm -f bc-app
docker rmi -f heojj97/bluecheck:0.4
docker build --tag heojj97/bluecheck:0.4 .
docker run -t -d --name bc-app -p 3000:3000 --link bc-mysql:db -e DATABASE_HOST=db heojj97/bluecheck:0.4