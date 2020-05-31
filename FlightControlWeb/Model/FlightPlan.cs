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
            var rndDigits = new System.Text.StringBuilder().Insert(0, "0123456789", 8)
                                .ToString().ToCharArray();
            return "FP" + string.Join("", rndDigits.OrderBy(o => Guid.NewGuid()).Take(8));
        }
    }
    
    public class Location
    {
        // Properties defenitions.
        // Mark all fields as required.
        [JsonProperty(Required = Required.Always)]
        [Range(-180.0, 180.0)]
        [JsonPropertyName("longitude")]
        public double Longitude { get; set; } = 200;
        [JsonPropertyName("latitude")]
        [Range(-90.0, 90.0)]
        public double Latitude { get; set; } = 100;
        [JsonPropertyName("date_time")]
        [Range(typeof(DateTime), "0001-01-01T00:00:00Z", "9999-12-31T11:59:59Z")]
        public DateTime Date_time { get; set; }

        public Location() {}
    }
    
    public class Segment
    {
        // Properties defenitions.
        // Mark all fields as required.
        [JsonProperty(Required = Required.Always)]
        [JsonPropertyName("longitude")]
        [Range(-180.0, 180.0)]
        public double Longitude { get; set; } = 200;
        [JsonPropertyName("latitude")]
        [Range(-90.0, 90.0)]
        public double Latitude { get; set; } = 100;
        [JsonPropertyName("timespan_seconds")]
        [Range(0, Int32.MaxValue - 1)]
        public double Timespan_seconds { get; set; } = -1;

        public Segment() {}
    }
}
