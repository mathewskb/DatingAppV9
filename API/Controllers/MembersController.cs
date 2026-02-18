using API.DTOs;
using API.Entities;
using API.Extensions;
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

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            // extension method to get member id from token 
            var memberId = User.GetMemberId();

            // var member = await memeberRepository.GetMemberByIdAsync(memberId);
            var member = await memeberRepository.GetMemberForUpdateAsync(memberId);
            
            if (member == null) return NotFound("No member found with given id");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            // update display name in user as well
            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            memeberRepository.Update(member); // optional and we are explicity telling the repo that member is being updated
            if (await memeberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update member");
        }
    }
}
