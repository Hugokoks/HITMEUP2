its chatting social media where you can chat in real time with your friends.

hello project db is running on docker ms sql img 
so if you want to run it you will need docker and node js 



step 1. 

///pull my docker img from my repository

docker pull hugobox1/mssql_hitmeup:v0.1

step 2.

///create docker container i suggest to use this command
///you can change password and port but you will need to change configDocker file in my server directory 

docker run --name my-sql-container -e ACCEPT_EULA=Y -e SA_PASSWORD=Password*123456789 -p 1588:1433 hugobox1/mssql_hitmeup:v0.1


step 3.

///if you created db you can now pull my app 

git clone https://github.com/Hugokoks/HITMEUP2.git

step 4.

////get in to client folder and type:

npm install

///do the same also in server folder

step 5.

///go to client folder start react type:

npm start

step 6.

///go to server folder 

///run API's type:

npm start

///run Web Socket type:

npm run wsServer 



