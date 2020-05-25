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
        // Mark required for all fields.
        [JsonProperty(Required = Required.Always)]
        [JsonPropertyName("flight_id")]
        public string Flight_id { get; set; }

        [JsonPropertyName("longitude")]
        public double Longitude { get; set; }

        [JsonPropertyName("latitude")]
        public double Latitude { get; set; }

        [JsonPropertyName("passengers")]
        [Range(0, Int32.MaxValue - 1)]
        public int Passengers { get; set; } = -1;

        [JsonPropertyName("company_name")]
        public string Company_name { get; set; }

        [JsonPropertyName("date_time")]
        public DateTime Date_time { get; set; }

        [JsonPropertyName("is_external")]
        public bool Is_external { get; set; }
    }
}
