﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using FlightControlWeb.Model;
using System.Net.Http;

namespace FlightControlWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private IMemoryCache cache;
        private FlightModel model;

        public FlightsController(IMemoryCache cache, HttpClient client = null)
        {
            this.cache = cache;
            // If http client is not supplied then create one.
            if (client == null)
            {
                this.model = new FlightModel(cache, new HttpClient());
            }
            else
            {
                this.model = new FlightModel(cache, client);
            }
        }

        // GET: api/Flights?relative_to=<DATE_TIME>.
        // GET: api/Flights?relative_to=<DATE_TIME>&sync_all.
        [HttpGet]
        public async Task<ActionResult<List<Flight>>> Get([FromQuery(Name ="relative_to")]
                                                            DateTime relativeTo)
        {
            relativeTo = relativeTo.ToUniversalTime();
            if (Request.Query.ContainsKey("sync_all"))
            {
                return Ok(await model.GetAllFlights(relativeTo));
            }
            return Ok(this.model.GetOurFlights(relativeTo));
        }

        // DELETE: api/Flights/5.
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            cache.Remove(id);
            // Remove the id from the keys list.
            var keysList = (List<string>)cache.Get("keys");
            keysList.Remove(id);
            cache.Set("keys", keysList);
            // Returns 204 status code which means that the server has successfully fulfilled 
            // the request and that there is no additional content to send in the 
            // response payload body.
            return NoContent();
        }
    }
}
