using BackEnd.Services;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly CloudinaryService _cloudinary;
    private readonly ILogger<UploadController> _logger;

    private static readonly string[] AllowedTypes =
        { "image/jpeg", "image/png", "image/webp", "image/gif" };

    private const long MaxFileSizeBytes = 5 * 1024 * 1024;

    public UploadController(CloudinaryService cloudinary, ILogger<UploadController> logger)
    {
        _cloudinary = cloudinary;
        _logger = logger;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Please choose an image file." });

        if (!AllowedTypes.Contains(file.ContentType))
            return BadRequest(new { message = "Only JPG, PNG, WEBP or GIF images are allowed." });

        if (file.Length > MaxFileSizeBytes)
            return BadRequest(new { message = "Image is too large (max 5 MB)." });

        ImageUploadResult result = await _cloudinary.UploadAsync(file);

        if (result.Error != null)
        {
            _logger.LogError("Cloudinary upload failed: {Error}", result.Error.Message);
            return StatusCode(502, new { message = "Cloudinary upload failed. Please try again." });
        }

        return Ok(new
        {
            message = "Image uploaded successfully.",
            imageUrl = result.SecureUrl.ToString(),
            publicId = result.PublicId
        });
    }
}
