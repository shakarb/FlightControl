using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using FlightControlWeb.Model;
using System.Collections;

namespace FlightControlWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightPlanController : ControllerBase
    {
        private IMemoryCache cache;

        public FlightPlanController(IMemoryCache cache)
        {
            this.cache = cache;
        }

        // GET: api/FlightPlan/id
        [HttpGet("{id}", Name = "Get")]
        public ActionResult<FlightPlan> Get(string id)
        {
            bool isOk = cache.TryGetValue(id, out FlightPlan fp);
            if (!isOk)
            {
                return NotFound(id);
            }
            // Returns 200 status code.
            return Ok(fp);
        }

        // POST: api/FlightPlan
        [HttpPost]
        public ActionResult Post([FromBody] FlightPlan fpDetails)
        {
            string key = fpDetails.GenerateId();
            cache.Set(key, fpDetails);
            return CreatedAtAction(actionName: "Get", new { id = key }, fpDetails);
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            cache.Remove(id);
            // Returns 204 status code which means that the server has successfully fulfilled 
            // the request and that there is no additional content to send in the response payload body.
            return NoContent();
        }
    }
}
