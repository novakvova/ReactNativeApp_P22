using System.ComponentModel.DataAnnotations.Schema;

namespace JustDoItApi.Entities.Chat;

/// <summary>
/// Тип чату (приватний, груповий тощо)
/// </summary>
[Table("tbl_chat_types")]
public class ChatTypeEntity : BaseEntity<long>
{
    public string TypeName { get; set; } = string.Empty;
    public virtual ICollection<ChatEntity>? Chats { get; set; }
}

