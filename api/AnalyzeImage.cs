using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace Company.Function
{
    public static class AnalyzeImage
    {
        [FunctionName("AnalyzeImage")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log, ExecutionContext context)
        {

            var config = new ConfigurationBuilder()
            .SetBasePath(context.FunctionAppDirectory)
            .AddJsonFile("local.settings.json",optional:true, reloadOnChange:true)
            .AddEnvironmentVariables()
            .Build();

            // Add your Computer Vision subscription key and endpoint
            string subscriptionKey = config["ComputerVisionKey"];
            string endpoint = "https://web-app-with-image-recog.cognitiveservices.azure.com/";

            // Create a client
            ComputerVisionClient client = Authenticate(endpoint, subscriptionKey);

            // Analyze an image to get features and other properties.
            var analysisResult= await AnalyzeImageUrl(client, "https://cdn.pixabay.com/photo/2012/03/01/00/55/garden-19830_960_720.jpg");

            
             
            return new OkObjectResult(analysisResult);
        }

        /*
        * AUTHENTICATE
        * Creates a Computer Vision client used by each example.
        */
        public static ComputerVisionClient Authenticate(string endpoint, string key)
        {
            ComputerVisionClient client =
            new ComputerVisionClient(new ApiKeyServiceClientCredentials(key))
            { Endpoint = endpoint };
            return client;
        }

         
        public static async Task<ImageAnalysis> AnalyzeImageUrl(ComputerVisionClient client, string imageUrl)
        {
            List<VisualFeatureTypes?> features = new List<VisualFeatureTypes?>()
            {
                VisualFeatureTypes.Categories, VisualFeatureTypes.Description,
                VisualFeatureTypes.Faces, VisualFeatureTypes.ImageType,
                VisualFeatureTypes.Tags, VisualFeatureTypes.Adult,
                VisualFeatureTypes.Color, VisualFeatureTypes.Brands,
                VisualFeatureTypes.Objects
            };

            ImageAnalysis results = await client.AnalyzeImageAsync(imageUrl, visualFeatures: features);

            return results;
        }
    }
}
