namespace JustDoItApi.Models.Chat;

public class ChatMessageModel
{
    public long Id { get; set; }
    public long ChatId { get; set; }
    public long UserId { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? UserName { get; set; }
    public string? UserImage { get; set; }
    public string? FileUrl { get; set; }
    public bool IsEdited { get; set; }
    public bool IsMine { get; set; }
    public long? ReplyToMessageId { get; set; }
    public string? ReplyToText { get; set; }
    public string? ReplyToUserName { get; set; }
}
