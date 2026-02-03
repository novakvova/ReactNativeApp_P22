using JustDoItApi.Entities.Identity;

namespace JustDoItApi.Interfaces
{
    public interface IJwtTokenService
    {
        Task<string> CreateTokenAsync(UserEntity user);
    }
}
