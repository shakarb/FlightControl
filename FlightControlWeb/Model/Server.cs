using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace FlightControlWeb.Model
{

    public class Server
    {
        // Properties defenitions.
        [JsonPropertyName("ServerId")]
        public string Id { get; set; }
        [JsonPropertyName("ServerURL")]
        public string Url { get; set; }

        public Server() {}
    }
}
