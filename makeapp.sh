docker rm -f bc-app
docker rmi -f simc26/bluecheck:0.1
docker build --tag simc26/bluecheck:0.1 .
docker run -t -d --name bc-app -p 3000:3000 --link bc-mysql:db --net ubuntu_default -e DATABASE_HOST=db simc26/bluecheck:0.1
