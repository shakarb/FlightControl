using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using Microsoft.CodeAnalysis;

namespace FlightControlWeb.Model
{
    public class FlightPlan
    {
        // Properties defenitions.
        [JsonPropertyName("passengers")]
        public int Passengers { get; set; }
        [JsonPropertyName("company_name")]
        public string Company_name { get; set; }

        [JsonPropertyName("initial_location")]
        public Location Initial_location { get; set; }
        
        [JsonPropertyName("segments")]
        public List<Segment> Segments { get; set; }
                
        public FlightPlan() {}

        // Generates flight id for cache entry.
        public string GenerateId()
        {
            var rndDigits = new System.Text.StringBuilder().Insert(0, "0123456789", 8).ToString().ToCharArray();
            return "FP" + string.Join("", rndDigits.OrderBy(o => Guid.NewGuid()).Take(8));
        }
    }
    
    public class Location
    {
        // Properties defenitions.
        [JsonPropertyName("longitude")]
        public double Lon { get; set; }
        [JsonPropertyName("latitude")]
        public double Lat { get; set; }
        [JsonPropertyName("date_time")]
        public DateTime Date { get; set; }

        public Location() {}
    }
    
    public class Segment
    {
        // Properties defenitions.
        [JsonPropertyName("longitude")]
        public double Lon { get; set; }
        [JsonPropertyName("latitude")]
        public double Lat { get; set; }
        [JsonPropertyName("timespan_seconds")]
        public double Timespan { get; set; }

        public Segment() {}
    }
}
