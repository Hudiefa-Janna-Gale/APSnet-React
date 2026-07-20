using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/[controller]")]   // => api/upload
public class UploadController : ControllerBase
{
    private readonly Cloudinary _cloudinary;

    // Only these types are accepted; everything else is rejected.
    private static readonly string[] AllowedTypes =
        { "image/jpeg", "image/png", "image/webp", "image/gif" };

    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

    public UploadController(IConfiguration configuration)
    {
        // Credentials live in appsettings.json under "Cloudinary"
        var account = new Account(
            configuration["Cloudinary:CloudName"],
            configuration["Cloudinary:ApiKey"],
            configuration["Cloudinary:ApiSecret"]);

        _cloudinary = new Cloudinary(account) { Api = { Secure = true } };
    }

    // POST: api/upload  -> multipart/form-data with one "file" field (Admin only)
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        // --- Server side validation ---
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Please choose an image file." });

        if (!AllowedTypes.Contains(file.ContentType))
            return BadRequest(new { message = "Only JPG, PNG, WEBP or GIF images are allowed." });

        if (file.Length > MaxFileSizeBytes)
            return BadRequest(new { message = "Image is too large (max 5 MB)." });

        using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "shophub/products",
            // Shrink very large photos on Cloudinary's side to keep the shop fast
            Transformation = new Transformation().Width(1200).Height(1200).Crop("limit")
        };

        ImageUploadResult result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
            return StatusCode(502, new { message = "Cloudinary upload failed: " + result.Error.Message });

        return Ok(new
        {
            message = "Image uploaded successfully.",
            imageUrl = result.SecureUrl.ToString(),
            publicId = result.PublicId
        });
    }
}
