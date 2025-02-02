﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using FlightControlWeb.Model;
using System.Collections;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;

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

        // GET: api/FlightPlan/id.
        [HttpGet("{id}", Name = "Get")]
        public async Task<ActionResult<FlightPlan>> Get(string id)
        {
            bool isOk = cache.TryGetValue(id, out FlightPlan fp);
            if (!isOk)
            {
                // Check if it's an external flight plan.
                // Then - return it.
                Dictionary<string, string> serverOf =
                   (Dictionary<string, string>)cache.Get("serverOfIds");
                bool ok = serverOf.TryGetValue(id, out string url);
                if (!ok)
                {
                    return NotFound(id);
                }
                try
                {
                    // Create http client.
                    HttpClient client = new HttpClient();
                    client.BaseAddress = new Uri(url);
                    client.DefaultRequestHeaders.Add("User-Agent", "C# console program");
                    client.DefaultRequestHeaders.Accept.Add(
                        new MediaTypeWithQualityHeaderValue("application/json"));
                    // Geting the flight plan from the server.
                    var resp = await client.GetStringAsync("/api/FlightPlan/" + id);
                    FlightPlan flightPlan = JsonConvert.DeserializeObject<FlightPlan>(resp);
                    return Ok(flightPlan);
                }
                catch (Exception)
                {
                    return NotFound(id);
                }

            }
            // Returns 200 status code.
            return Ok(fp);
        }

        // POST: api/FlightPlan.
        [HttpPost]
        public ActionResult Post([FromBody] FlightPlan fpDetails)
        {
            if (ModelState.IsValid)
            {
                string key = fpDetails.GenerateId();
                cache.Set(key, fpDetails);
                // Updating the keys list with a new key.
                var keysList = (List<string>)cache.Get("keys");
                keysList.Add(key);
                cache.Set("keys", keysList);
                // Save the flight id in the response headers (for testing it).
                HttpContext.Response.Headers["Location"] = key;
                var resp = CreatedAtAction(actionName: "Get", new { id = key }, fpDetails);
                return resp;
            } 
            return BadRequest("Not a valid flight plan");    
        }
    }
}
