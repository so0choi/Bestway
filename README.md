## BlueCheck
🔨아파트 유지보수 시스템  
Apartment Hot-Fix System
<hr>

### Used Stack
`Node.js` `VanillaJS` `HTML5/CSS3` `MySQL` `Docker` `React-native` `Firebase`

### Requirement
> `git` `Docker` `MySQL(or Maria) Database Docker`
<hr>

### Clone this git
```git clone https://github.com/zinirun.BlueCheck.git```

### Setup your database at your git repository
- Open vim editor 
```vi makeapp.sh```  
- Edit script at `--link` for running docker container  
```--link YOUR_DB_NAME:db```
- Run shellscript at your git repository
```chmod +x makeapp.sh; ./makeapp.sh```
<hr>

### After running service
- Attach Docker Container
```docker exec -it bc-app```
- View Node logs
```docker logs bc-app```
