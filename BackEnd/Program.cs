using System.Text;
using BackEnd.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Enable API controllers (ProductsController, UsersController, ...)
builder.Services.AddControllers();

// 2. TokenService creates the JWT token after login (see Services/TokenService.cs)
builder.Services.AddScoped<TokenService>();

// 3. AUTHENTICATION: teach the API how to READ and VERIFY the JWT token
//    that the React app sends in the "Authorization: Bearer ..." header.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,            // token must come from OUR API
            ValidateAudience = true,          // token must be meant for OUR React app
            ValidateLifetime = true,          // expired tokens are rejected
            ValidateIssuerSigningKey = true,  // signature must match our secret key
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// 4. AUTHORIZATION: enables [Authorize] and [Authorize(Roles = "Admin")]
builder.Services.AddAuthorization();

// 5. Enable Swagger so we can test every endpoint in the browser
//    (with an "Authorize" button to paste the JWT token)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Paste ONLY the token here (Swagger adds 'Bearer ' for you)."
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// 6. Enable CORS so the React app (another port) is allowed to call this API
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

// ORDER MATTERS: first WHO are you (authentication),
// then WHAT are you allowed to do (authorization).
app.UseAuthentication();
app.UseAuthorization();

// Map every [Route] defined in the controllers
app.MapControllers();

app.Run();
