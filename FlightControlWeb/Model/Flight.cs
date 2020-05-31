using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FlightControlWeb.Model
{
    public class Flight
    {
        // Properties defenitions.
        // Mark all fields as required.
        [JsonProperty(Required = Required.Always)]
        [JsonPropertyName("flight_id")]
        public string Flight_id { get; set; }

        [JsonPropertyName("longitude")]
        [Range(-180.0, 180.0)]
        public double Longitude { get; set; } = 200;

        [JsonPropertyName("latitude")]
        [Range(-90.0, 90.0)]
        public double Latitude { get; set; } = 100;

        [JsonPropertyName("passengers")]
        [Range(0, Int32.MaxValue - 1)]
        public int Passengers { get; set; } = -1;

        [JsonPropertyName("company_name")]
        public string Company_name { get; set; }

        [JsonPropertyName("date_time")]
        [Range(typeof(DateTime), "0001-01-01T00:00:00Z", "9999-12-31T11:59:59Z")]
        public DateTime Date_time { get; set; }

        [JsonPropertyName("is_external")]
        public bool Is_external { get; set; }
    }
}
