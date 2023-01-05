# Timely
Timely is a time tracking software used by developers to track how much time they spent on each project they’re working on. 
Timely can be used for multiple projects and it allows you to log work sessions.

Timely application consists of:
- Timely backend writen in C#, ASP.NET, Entity Core and PostgreSQL database.
- Tomely frontend written in Angular

## How to install

### Database
Database is runned through Docker, to start it run:

```
cd TimelyBackend
docker compose up
```

After the database starts run:
```
dotnet ef database update
```

to sync the backend app and the database.

### Starting backend
Backend is started with:
```
dotnet run
```
The backend app started, you can access it by going to `http://localhost:5700`

### Starting frontend
Frontend is started with a play arrow(debug mode) inside a visual studio once the project is opened. 
It is important to start it in a development mode so the proxy config gets set.
Once the frontend app starts it is served on `https://localhost:4200`
