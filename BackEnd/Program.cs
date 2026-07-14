var builder = WebApplication.CreateBuilder(args);

// 1. Enable API controllers (ProductsController, UsersController, ...)
builder.Services.AddControllers();

// 2. Enable Swagger so we can test every endpoint in the browser
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. Enable CORS so the React app (another port) is allowed to call this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Swagger UI is available at /swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowReactApp");

// Map every [Route] defined in the controllers
app.MapControllers();

app.Run();
