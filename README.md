# TaskFullStack

## Versioning

This project is in develop mode, thus clone it from Github and switch to Devel branch
```git fetch origin devel``` 
```git checkout devel```

When this project will be ultimated, devel branch will be merged on main branch, using "Dockerfile" and not "Dockerfile.dev" anymore.

Further development will include:
- Toast message to manage errors
- Mobile @media adapting
- Decrypting CUBBIT algorithm and use it

## DOCKER DESKTOP

This project was made under docker. Thus, if you are using Windows, need to install Docker Desktop.

Here you can use docker-compose to run the project using the shortcut:

```npm run dockerstart```

and you can navigate in browser using localhost:
```http://localhost:8080```

Docker compose services:
- Express Server
- Mysql db
- Redis

ps: if you want to see the loading square, import a file bigger than 1 MB (in order to take more time to manage the request)
