using System;
using System.Collections.Generic;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net;
using System.Threading;
using Newtonsoft.Json;

namespace FlightControlTests
{
    // HttpMessageHandlerStub takes care of requests by faking their result. 
    public class HttpMessageHandlerStub : DelegatingHandler
    {
        // Override SendAsync method which is invoked after every call of HttpClient (like GetAsync).
        // This method returns a static Flight resoponse.
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            string json = @"[{
            'flight_id': 'FP00000000',
            'longitude': 35,
            'latitude': 20.9,
            'passengers': 150,
            'company_name': 'SwissAir',
            'date_time': '2020-05-27T15:56:00Z'
                }]";

            var responseMessage = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json)
            };
            return await Task.FromResult(responseMessage);

        }
    }
}
