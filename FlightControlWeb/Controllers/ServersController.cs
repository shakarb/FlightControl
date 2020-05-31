using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using FlightControlWeb.Model;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace FlightControlWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServersController : ControllerBase
    {
        private IMemoryCache cache;

        public ServersController(IMemoryCache cache)
        {
            this.cache = cache;
        }

        // GET: api/Servers.
        [HttpGet (Name = "GetServ")]
        public ActionResult<List<Server>> GetServ()
        {
            bool isOk = cache.TryGetValue("servers", out List<Server> servList);
            if(!isOk)
            {
                return NotFound();
            }
            // Returns 200 status code.
            return Ok(servList);
        }

        // POST: api/Servers.
        [HttpPost]
        public ActionResult Post([FromBody] Server serverDetails)
        {
            if (ModelState.IsValid)
            {
                if (serverDetails.Url.EndsWith("/"))
                    serverDetails.Url = serverDetails.Url.Remove(serverDetails.Url.Length - 1);
                var servList = ((IEnumerable<Server>)cache.Get("servers")).ToList();
                servList.Add(serverDetails);
                cache.Set("servers", servList);
                return CreatedAtAction(actionName: "GetServ", serverDetails);
            }
            return BadRequest("Not a valid server");
        }

        // DELETE: api/ApiWithActions/5.
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var servList = ((IEnumerable<Server>)cache.Get("servers")).ToList();
            servList.RemoveAll(s => s.Id.Equals(id));
            cache.Set("servers", servList);
            // Returns 204 status code which means that the server has successfully fulfilled 
            // the request and that there is no additional content to send in the 
            // response payload body.
            return NoContent();
        }
    }
}
