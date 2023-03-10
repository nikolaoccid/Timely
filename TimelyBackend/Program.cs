using Microsoft.EntityFrameworkCore;
using TimelyBackend;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});

var connectionString = builder.Configuration.GetConnectionString("TimelyContext");
builder.Services.AddDbContext<TimelyContext>(x => x.UseNpgsql(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddControllers();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TimelyBackend v1");
    c.RoutePrefix = "";
    });

app.UseCors();
app.UseHttpsRedirection();

//app.UseAuthorization();

app.MapControllers();

app.Run();
