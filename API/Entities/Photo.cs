using System;
using System.Runtime.CompilerServices;

namespace API.Entities;

public class Photo
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public string? PublicId { get; set; }
    public bool IsApproved { get; set; }

    // Navigation property
    public Member Member { get; set; } = null!;
    public string MemberId { get; set; } =null!;
}
