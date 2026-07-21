using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

public abstract class SecureController : ControllerBase
{

    protected int CurrentUserId =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

    protected bool IsAdmin => User.IsInRole("Admin");
}
