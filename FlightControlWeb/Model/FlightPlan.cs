using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using Microsoft.CodeAnalysis;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FlightControlWeb.Model
{
    public class FlightPlan
    {
        // Properties defenitions.
        // Mark required for all fields.
        [JsonProperty(Required = Required.Always)]
        [JsonPropertyName("passengers")]
        [Range(0, Int32.MaxValue - 1)]
        public int Passengers { get; set; } = -1;
        [JsonPropertyName("company_name")]
        public string Company_name { get; set; }

        [JsonPropertyName("initial_location")]
        public Location Initial_location { get; set; }
        
        [JsonPropertyName("segments")]
        public List<Segment> Segments { get; set; }
                
        public FlightPlan() {

        }

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
        [JsonProperty(Required = Required.Always)]
        [JsonPropertyName("longitude")]
        public double Longitude { get; set; }
        [JsonPropertyName("latitude")]
        public double Latitude { get; set; }
        [JsonPropertyName("date_time")]
        public DateTime Date_time { get; set; }

        public Location() {}
    }
    
    public class Segment
    {
        // Properties defenitions.
        [JsonProperty(Required = Required.Always)]
        [JsonPropertyName("longitude")]
        public double Longitude { get; set; }
        [JsonPropertyName("latitude")]
        public double Latitude { get; set; }
        [JsonPropertyName("timespan_seconds")]
        [Range(0, Int32.MaxValue - 1)]
        public double Timespan_seconds { get; set; } = -1;

        public Segment() {}
    }
}
