using AutoMapper;
using JustDoItApi.Data;
using JustDoItApi.Entities.Chat;
using JustDoItApi.Interfaces;
using JustDoItApi.Models.Chat;
using Microsoft.EntityFrameworkCore;

namespace JustDoItApi.Services;

public class ChatService(
    AppDbContext context,
    IIdentityService identityService,
    IMapper mapper) : IChatService
{
    public async Task<long> CreateChatAsync(ChatCreateModel model)
    {
        var userId = await identityService.GetUserIdAsync();

        var chat = mapper.Map<ChatEntity>(model, opt =>
        {
            opt.Items["UserId"] = userId;
        });

        context.Chats.Add(chat);
        await context.SaveChangesAsync();

        return chat.Id;
    }

    public Task<List<ChatTypeItemModel>> GetAllTypes()
    {
        return context.ChatTypes
            .AsNoTracking()
            .Select(ct => mapper.Map<ChatTypeItemModel>(ct))
            .ToListAsync();
    }

    public async Task<List<ChatMessageModel>> GetChatMessagesAsync(long chatId)
    {
        var currentUserId = await identityService.GetUserIdAsync();

        var isMember = await context.ChatUsers
            .AnyAsync(cu => cu.ChatId == chatId && cu.UserId == currentUserId);

        if (!isMember) throw new UnauthorizedAccessException("Ви не є учасником цього чату");

        var messages = await context.ChatMessages
            .AsNoTracking()
            .Where(m => m.ChatId == chatId)
            .Include(m => m.User) 
            .Include(m => m.ReplyToMessage) 
                .ThenInclude(rm => rm!.User) 
            .OrderBy(m => m.DateCreated)
            .ToListAsync();

        return mapper.Map<List<ChatMessageModel>>(messages, opt =>
        {
            opt.Items["CurrentUserId"] = currentUserId;
        });
    }

    public async Task<List<ChatItemModel>> GetUserChatsAsync()
    {
        var userId = await identityService.GetUserIdAsync();

        var chats = await context.Chats
            .AsNoTracking()
            .Include(c => c.ChatType)
            .Where(c => c.ChatUsers!.Any(cu => cu.UserId == userId))
            .OrderByDescending(c => c.Id)
            .ToListAsync();

        return mapper.Map<List<ChatItemModel>>(chats);
    }

    public async Task<ChatMessageModel> SendMessageAsync(SendMessageModel model)
    {
        var userId = await identityService.GetUserIdAsync();

        var isMember = await context.ChatUsers
            .AnyAsync(x => x.ChatId == model.ChatId && x.UserId == userId);

        if (!isMember)
            throw new UnauthorizedAccessException("User is not in chat");

        var message = new ChatMessageEntity
        {
            ChatId = model.ChatId,
            UserId = userId,
            Message = model.Message
        };

        context.ChatMessages.Add(message);
        await context.SaveChangesAsync();

        return mapper.Map<ChatMessageModel>(message, opt =>
        {
            opt.Items["CurrentUserId"] = userId;
        });
    }
}