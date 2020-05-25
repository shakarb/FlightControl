using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using System.Security.Policy;
using Newtonsoft.Json;

namespace FlightControlWeb.Model
{

    public class Server
    {
        // Properties defenitions.
        // Mark required for all fields.
        [JsonProperty(Required = Required.Always)]
        [JsonPropertyName("ServerId")]
        public string Id { get; set; }
        [JsonPropertyName("ServerURL")]
        public string Url { get; set; }

        public Server() {}

    }

}
