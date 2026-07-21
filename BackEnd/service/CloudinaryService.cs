using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace BackEnd.Services;

public class CloudinaryService
{
    private readonly Cloudinary _cloudinary;
    private readonly ILogger<CloudinaryService> _logger;
    private const string ProductsFolder = "shophub/products";

    public CloudinaryService(IConfiguration configuration, ILogger<CloudinaryService> logger)
    {
        var account = new Account(
            configuration["Cloudinary:CloudName"],
            configuration["Cloudinary:ApiKey"],
            configuration["Cloudinary:ApiSecret"]);

        _cloudinary = new Cloudinary(account) { Api = { Secure = true } };
        _logger = logger;
    }

    public Task<ImageUploadResult> UploadAsync(IFormFile file)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = ProductsFolder,

            Transformation = new Transformation().Width(1200).Height(1200).Crop("limit")
        };

        return _cloudinary.UploadAsync(uploadParams);
    }

    public async Task<bool> DeleteByUrlAsync(string? imageUrl)
    {
        var publicId = ExtractPublicId(imageUrl);
        if (publicId is null)
        {
            _logger.LogWarning("Skipped Cloudinary delete: could not extract publicId from '{Url}'", imageUrl);
            return false;
        }

        var result = await _cloudinary.DestroyAsync(new DeletionParams(publicId)
        {
            Invalidate = true
        });
        bool ok = string.Equals(result.Result, "ok", StringComparison.OrdinalIgnoreCase);

        if (ok)
            _logger.LogInformation("Deleted Cloudinary image {PublicId}", publicId);
        else
            _logger.LogWarning("Cloudinary delete for {PublicId} returned '{Result}'", publicId, result.Result);

        return ok;
    }

    public static string? ExtractPublicId(string? url)
    {
        if (string.IsNullOrWhiteSpace(url) || !url.Contains("res.cloudinary.com"))
            return null;

        const string marker = "/upload/";
        int idx = url.IndexOf(marker, StringComparison.Ordinal);
        if (idx < 0) return null;

        string path = url[(idx + marker.Length)..];
        var parts = path.Split('/').ToList();

        if (parts.Count > 0 && parts[0].Length > 1 && parts[0][0] == 'v'
            && parts[0].Skip(1).All(char.IsDigit))
        {
            parts.RemoveAt(0);
        }

        string joined = string.Join('/', parts);
        int dot = joined.LastIndexOf('.');
        if (dot > 0) joined = joined[..dot];

        return string.IsNullOrWhiteSpace(joined) ? null : joined;
    }
}
