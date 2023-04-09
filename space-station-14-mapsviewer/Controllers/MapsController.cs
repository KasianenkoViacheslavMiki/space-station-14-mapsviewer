using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using space_station_14_mapsviewer.Strategy.ParallaxStrategy;
using System.Drawing;
using System.Net;
using System.Net.Http.Headers;

namespace space_station_14_mapsviewer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MapsController : ControllerBase
    {
        private readonly ILogger<MapsController> _logger;

        readonly string currentPath="";

        public MapsController(ILogger<MapsController> logger)
        {
            _logger = logger;
            currentPath = Directory.GetCurrentDirectory();
        }

        [HttpGet("GetTest")]
        public IActionResult GetTest()
        {
            return Ok("API Work");
        }

        [HttpGet("GetNameMaps")]
        public IActionResult GetNameMaps()
        {
            List<string> pathMaps = Directory.GetFiles(currentPath + @"\wwwroot\MapsFolder").ToList();
            List<string> nameMaps = new List<string>();

            foreach (string pathMap in pathMaps)
            {
                var nameAndPng = pathMap.Split(@"\").Last();
                nameMaps.Add(nameAndPng.Split(@".")[0]);
            }

            if (pathMaps.Count == 0)
            {
                return NotFound();
            }

            return Ok(nameMaps);
        }

        [HttpGet("GetJsonMap/{quality}/{nameMap}")]
        public IActionResult GetJsonMap(string quality,string nameMap)
        {
            if (!System.IO.File.Exists(currentPath + @"\wwwroot\MapsFolder\" + nameMap + ".json"))
            {
                return NotFound();
            }

            GetJsonMap items = new GetJsonMap();

            using (StreamReader r = new StreamReader(currentPath + @"\wwwroot\MapsFolder\" + nameMap + ".json"))
            {
                string json = r.ReadToEnd();
                items = JsonConvert.DeserializeObject<GetJsonMap>(json);
            }

            SendJsonMap result = new SendJsonMap();

            result.Name = items.Name;

            if (quality == "webp")
            {
                result.Url = items.urlWebp;
            }
            else if (quality == "png")
            {
                result.Url = items.urlPng;
            }

            result.Extent = items.Extent;

            return Ok(result);
        }

        [HttpGet("GetParallaxes/{nameMap}")]
        public IActionResult GetParallaxes(string nameMap)
        {
            IParallaxes parallaxes;

            if (nameMap == "Aspid")
            {
                parallaxes = new AspidParallax();
            }
            else if (nameMap == "Kettle")
            {
                parallaxes = new KettleParallax();
            }
            else 
            {
                parallaxes = new OtherParralax();
            }


            if (!System.IO.File.Exists(currentPath + @"\wwwroot\"+ parallaxes.GetPath()))
            {
                return NotFound();
            }

            GetJsonMap items = new GetJsonMap();

            using (StreamReader r = new StreamReader(currentPath + @"\wwwroot\" + parallaxes.GetPath()))
            {
                string json = r.ReadToEnd();
                items = JsonConvert.DeserializeObject<GetJsonMap>(json);
            }

            SendJsonMap result = new SendJsonMap();
            result.Name = items.Name;

            result.Url = items.urlWebp;

            result.Extent = items.Extent;

            return Ok(result);
        }
    }
    [Serializable]
    class GetJsonMap
    {
        public string Name { get; set; }
        public string urlWebp { get; set; }
        public string urlPng { get; set; }
        public Extent Extent { get; set; }
    }
    [Serializable]
    class SendJsonMap
    {
        public string Name { get; set; }

        public string Url { get; set; }

        public Extent Extent { get; set; }
    }
    [Serializable]
    class Extent
    {
        public float X1 { get; set; }
        public float Y1 { get; set; }

        public float X2 { get; set; }
        public float Y2 { get; set; }
    }
}