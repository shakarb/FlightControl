using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization;
using System.Security.Permissions;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

namespace FlightControlWeb.Model
{
    public class FlightModel
    {
        private IMemoryCache cache;
        private HttpClient client;

        public FlightModel(IMemoryCache cache, HttpClient client)
        {
            this.cache = cache;
            this.client = client;
        }

        // Returns the server's internal flights.
        public List<Flight> GetOurFlights(DateTime currentTime)
        {
            List<Flight> flights = new List<Flight>();
            var keysList = (List<string>)cache.Get("keys");
            foreach (string key in keysList)
            {
                FlightPlan fp = (FlightPlan)cache.Get(key);
                DateTime startTime = fp.InitialLocation.DateTime;
                if (currentTime < startTime)
                {
                    continue;
                }
                int segNum = 0;
                Segment currSegment = FindSegment(fp, currentTime, ref startTime, ref segNum);
                if (currSegment == null)
                {
                    continue;
                }
                double precent = (currentTime - startTime).TotalSeconds / 
                    currSegment.TimespanSeconds;
                // Prepare the details of the new flight.
                Flight newFlight = new Flight();
                double prevLon, prevLat;
                if (segNum == 0)
                {
                    prevLon = fp.InitialLocation.Longitude;
                    prevLat = fp.InitialLocation.Latitude;
                }
                else
                {
                    prevLon = fp.Segments[segNum - 1].Longitude;
                    prevLat = fp.Segments[segNum - 1].Latitude;
                }
                newFlight.Longitude = prevLon + (currSegment.Longitude - prevLon) * precent;
                newFlight.Latitude = prevLat + (currSegment.Latitude - prevLat) * precent;
                newFlight.FlightId = key;
                newFlight.CompanyName = fp.CompanyName;
                newFlight.Passengers = fp.Passengers;
                newFlight.IsExternal = false;
                newFlight.DateTime = fp.InitialLocation.DateTime;
                flights.Add(newFlight);
            }
            return flights;
        }

        public async Task<List<Flight>> GetAllFlights(DateTime currentTime)
        {
            // Add this server's flights.
            List<Flight> flights = new List<Flight>(GetOurFlights(currentTime));
            List<Server> serversList = (List<Server>)cache.Get("servers");
            foreach (Server server in serversList)
            {
                client.BaseAddress = new Uri(server.Url);
                client.DefaultRequestHeaders.Add("User-Agent", "C# console program");
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                List<Flight> outerFlights = new List<Flight>();
                try
                {
                    var resp = await client.GetStringAsync(server.Url + "/api/Flights?relative_to="
                        + currentTime.ToString("yyyy-MM-ddTHH:mm:ssZ"));
                    outerFlights.AddRange(JsonConvert.DeserializeObject<List<Flight>>(resp));
                    SaveUrlOfId(outerFlights, server.Url);
                }
                catch (Exception)
                {
                }
                foreach (Flight flight in outerFlights)
                    flight.IsExternal = true;
                
                flights.AddRange(outerFlights);
            }
            return flights;
        }


        // Finds which segment of the flight plan contains the given time.
        // Curr is the start time of the segment.
        private Segment FindSegment(FlightPlan fp, DateTime time, ref DateTime curr, 
                                            ref int segNum)
        {
            foreach (Segment segment in fp.Segments)
            {
                if ((curr = curr.AddSeconds(segment.TimespanSeconds)) > time)
                {
                    // Make curr to be the start time of the segment.
                    curr = curr.AddSeconds(-segment.TimespanSeconds);
                    return segment;
                }else
                {
                    segNum++;
                }
            }
            return null;
        }

        private void SaveUrlOfId(List<Flight> flights, string url)
        {
            // Get the flight plan's dictionary from the cache.
            Dictionary<string, string> serverOf =
                   (Dictionary<string, string>)cache.Get("serverOfIds");
            foreach (Flight flight in flights)
            {
                if (!serverOf.ContainsKey(flight.FlightId))
                {
                    // Insert the flight plan into the outer flight plans dictionary.
                    serverOf[flight.FlightId] = url;
                }
            }
            cache.Set("serverOfIds", serverOf);
        }
    }
}
