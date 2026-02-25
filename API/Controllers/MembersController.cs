using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    [Authorize]
    public class MembersController(IMemeberRepository memeberRepository, IPhotoService photoService) : BaseApiController
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


        // add photo for member
        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var memberId = User.GetMemberId();

            var member = await memeberRepository.GetMemberByIdAsync(memberId);

            if (member == null) return BadRequest("Cannot update member with given id");

            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId()
            };

            if(member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }

            member.Photos.Add(photo);

            if (await memeberRepository.SaveAllAsync())
                return photo;
                //return CreatedAtAction(nameof(GetMember), new { id = member.Id }, photo);

            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {

            var member = await memeberRepository.GetMemberForUpdateAsync(User.GetMemberId());

            if (member == null) return BadRequest("Cannot find member from token");

            var photo = member.Photos.SingleOrDefault(p => p.Id == photoId);

            if(member.ImageUrl == photo?.Url || photo == null)
            {
                return BadRequest("Cannot set this as main image");
            }
                
            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            if (await memeberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo");
        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await memeberRepository.GetMemberForUpdateAsync(User.GetMemberId());

            if (member == null) return BadRequest("Cannot find member from token");

            var photo = member.Photos.SingleOrDefault(p => p.Id == photoId);

            if(photo == null || photo.Url == member.ImageUrl) 
                return BadRequest("This photo cannot be deleted");

            if(photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error != null) return BadRequest(result.Error.Message);
            }

            member.Photos.Remove(photo);

            if (await memeberRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete photo");
        }
    }
}