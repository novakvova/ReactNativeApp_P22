using AutoMapper;
using JustDoItApi.Entities.Chat;
using JustDoItApi.Models.Chat;

namespace JustDoItApi.Mapper;

public class ChatMapper : Profile
{
    public ChatMapper()
    {
        CreateMap<ChatCreateModel, ChatEntity>()
            .ForMember(dest => dest.ChatUsers, opt => opt.MapFrom(
                (src, _, _, ctx) =>
                {
                    var currentUserId = (long)ctx.Items["UserId"];

                    return src.UserIds
                        .Append(currentUserId)
                        .Distinct()
                        .Select(id => new ChatUserEntity
                        {
                            UserId = id,
                            IsAdmin = id == currentUserId
                        }).ToList();
                }));

        CreateMap<ChatMessageEntity, ChatMessageModel>()
           .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.DateCreated))
           .ForMember(dest => dest.UserName, opt => opt.MapFrom(src =>
               src.User != null ? $"{src.User.FirstName} {src.User.LastName}".Trim() : "Anonymous"))
           .ForMember(dest => dest.UserImage, opt => opt.MapFrom(src => src.User != null ? src.User.Image : null))
           .ForMember(
               dest => dest.IsMine,
               opt => opt.MapFrom((src, _, _, context) =>
                   src.UserId == (long)context.Items["CurrentUserId"]
               )
           )
           .ForMember(dest => dest.ReplyToText, opt => opt.MapFrom(src => src.ReplyToMessage != null ? src.ReplyToMessage.Message : null))
           .ForMember(dest => dest.ReplyToUserName, opt => opt.MapFrom(src =>
               src.ReplyToMessage != null && src.ReplyToMessage.User != null ? src.ReplyToMessage.User.FirstName : null));

        CreateMap<ChatTypeEntity, ChatTypeItemModel>();

        CreateMap<ChatEntity, ChatItemModel>()
            .ForMember(dest => dest.ChatTypeName, opt => opt.MapFrom(src => src.ChatType != null ? src.ChatType.TypeName : null));
    }
}