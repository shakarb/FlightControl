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

        /*
         * for testing
         */
        // GET: api/FlightPlan/listSize
        [HttpGet("listSize")]
        public ActionResult<int> Get()
        {
            var keysList = (List<string>)cache.Get("keys");
            // Returns 200 status code.
            return Ok(keysList.Count());
        }


        // GET: api/FlightPlan/id
        [HttpGet("{id}", Name = "Get")]
        public ActionResult<FlightPlan> Get(string id)
        {
            bool isOk = cache.TryGetValue(id, out FlightPlan fp);
            if (!isOk)
            {
                // Check if it's an external flight plan.
                // Then - return it.
                Dictionary<string, FlightPlan> outerFP =
                   (Dictionary<string, FlightPlan>)cache.Get("outerFlightPlans");
                bool ok = outerFP.TryGetValue(id, out FlightPlan flightPlan);
                if (!ok)
                {
                    return NotFound(id);
                }
                return Ok(flightPlan);
            }
            // Returns 200 status code.
            return Ok(fp);
        }

        // POST: api/FlightPlan
        [HttpPost]
        public ActionResult Post([FromBody] FlightPlan fpDetails)
        {
            Console.WriteLine("Im in POST");
            string key = fpDetails.GenerateId();
            cache.Set(key, fpDetails);

            // Updating the keys list with a new key.
            var keysList = (List<string>)cache.Get("keys");
            keysList.Add(key);
            cache.Set("keys", keysList);

            return CreatedAtAction(actionName: "Get", new { id = key }, fpDetails);
        }

    }
}
