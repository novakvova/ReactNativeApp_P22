using JustDoItApi.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace JustDoItApi.Entities.Chat;

/// <summary>
/// Хто і коли прочитав повідомлення в чаті
/// </summary>
[Table("tbl_chat_message_reads")]
public class ChatMessageReadEntity
{
    public long MessageId { get; set; }
    public ChatMessageEntity? Message { get; set; }

    public long UserId { get; set; }
    public UserEntity? User { get; set; }

    public DateTime ReadAt { get; set; } = DateTime.UtcNow;
}
