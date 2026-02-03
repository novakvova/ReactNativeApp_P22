using JustDoItApi.Interfaces;
using JustDoItApi.Models.Chat;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JustDoItApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChatsController(IChatService chatService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateChat([FromBody] ChatCreateModel model)
    {
        var chatId = await chatService.CreateChatAsync(model);
        return Ok(chatId);
    }

    [HttpGet("types")]
    public async Task<IActionResult> GetChatTypes()
    {
        var types = await chatService.GetAllTypes();
        return Ok(types);
    }

    [HttpGet]
    public async Task<IActionResult> GetUserChats()
    {
        var chats = await chatService.GetUserChatsAsync();
        return Ok(chats);
    }

    [HttpGet("{chatId:long}/messages")]
    public async Task<IActionResult> GetChatMessages([FromRoute] long chatId)
    {
        var messages = await chatService.GetChatMessagesAsync(chatId);
        return Ok(messages);
    }
}