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

        public FlightModel(IMemoryCache cache)
        {
            this.cache = cache;
        }

        public List<Flight> GetOurFlights(DateTime currentTime)
        {
            List<Flight> flights = new List<Flight>();
            var keysList = (List<string>)cache.Get("keys");
            foreach (string key in keysList)
            {
                FlightPlan fp = (FlightPlan)cache.Get(key);
                DateTime startTime = fp.Initial_location.Date_time;
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
                double precent = (currentTime - startTime).TotalSeconds / currSegment.Timespan_seconds;
                Flight newFlight = new Flight();
                double prevLon, prevLat;
                if (segNum == 0)
                {
                    prevLon = fp.Initial_location.Longitude;
                    prevLat = fp.Initial_location.Longitude;
                }
                else
                {
                    prevLon = fp.Segments[segNum - 1].Longitude;
                    prevLat = fp.Segments[segNum - 1].Latitude;
                }
                newFlight.Longitude = prevLon + (currSegment.Longitude - prevLon) * precent;
                newFlight.Latitude = prevLat + (currSegment.Latitude - prevLat) * precent;
                newFlight.Flight_id = key;
                newFlight.Company_name = fp.Company_name;
                newFlight.Passengers = fp.Passengers;
                newFlight.Is_external = false;
                newFlight.Date_time = fp.Initial_location.Date_time;
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
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(server.Url);
                client.DefaultRequestHeaders.Add("User-Agent", "C# console program");
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                List<Flight> outerFlights = new List<Flight>();
                try
                {
                    var resp = await client.GetStringAsync(server.Url + "/api/Flights?relative_to="
                        + currentTime.ToString("yyyy-MM-ddTHH:mm:ss"));
                    outerFlights.AddRange(JsonConvert.DeserializeObject<List<Flight>>(resp));
                    GetFlightPlans(outerFlights,server.Url, client);
                }
                catch (Exception)
                {
                    Console.WriteLine("Failed in external flight get response");
                }
                foreach (Flight flight in outerFlights)
                    flight.Is_external = true;
                
                flights.AddRange(outerFlights);
            }
            return flights;
        }


        // Finds which segment of the flight plan contains the given time.
        // Curr will be the start time of the segment.
        private Segment FindSegment(FlightPlan fp, DateTime time, ref DateTime curr, ref int segNum)
        {
            foreach (Segment segment in fp.Segments)
            {
                if ((curr = curr.AddSeconds(segment.Timespan_seconds)) > time)
                {
                    // Make curr to be the start time of the segment.
                    curr = curr.AddSeconds(-segment.Timespan_seconds);
                    return segment;
                }else
                {
                    segNum++;
                }
            }
            return null;
        }

        private async void GetFlightPlans(List<Flight> flights, string url, HttpClient client)
        {
            foreach(Flight flight in flights)
            {
                // Geting the flight plan from the server.
                var resp = await client.GetStringAsync(url + "/api/FlightPlan/"
                    + flight.Flight_id.ToString());
                FlightPlan fp = JsonConvert.DeserializeObject<FlightPlan>(resp);

                // Insert the flight plan into the outer flight plans dictionary.
                Dictionary<string, FlightPlan> outerFP =
                    (Dictionary<string,FlightPlan>)cache.Get("outerFlightPlans");
                outerFP[flight.Flight_id] = fp;
                cache.Set("outerFlightPlans", outerFP);
            }
        }

    }
}
