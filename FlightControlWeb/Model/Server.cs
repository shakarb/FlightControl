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
        // Mark all fields as required.
        [JsonProperty(Required = Required.Always)]
        [JsonPropertyName("ServerId")]
        public string Id { get; set; }
        [JsonPropertyName("ServerURL")]
        public string Url { get; set; }

        public Server() {}

    }

}
