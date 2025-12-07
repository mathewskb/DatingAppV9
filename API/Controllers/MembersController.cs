using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    [Authorize]
    public class MembersController(IMemeberRepository memeberRepository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await memeberRepository.GetMembersAsync());
        }


        [HttpGet("{id}")] // locahost:5001/api/members/bob-id
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memeberRepository.GetMemberByIdAsync(id);

            if (member == null) return NotFound();

            return member;

        }

        [HttpGet("{id}/photos")] // locahost:5001/api/members/bob-id
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await memeberRepository.GetPhotosForMemberAsync(id));
        }
    }
}
