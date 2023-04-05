using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("GetJsonMap/{nameMap}")]
        public IActionResult GetJsonMap(string nameMap)
        {
            if (!System.IO.File.Exists(currentPath + @"\wwwroot\MapsFolder\" + nameMap + ".png"))
            {
                return NotFound();
            }
            Bitmap img = new Bitmap(currentPath + @"\wwwroot\MapsFolder\" + nameMap + ".png");

            
            JsonMap jsonMap = new JsonMap();

            jsonMap.Name = nameMap;
            jsonMap.Extent = new Extent
            {
                X1 = 0,
                Y1= 0,
                X2 = (float)img.Height,
                Y2 = (float)img.Width,
            };

            return Ok(jsonMap);
        }
        [HttpGet("GetMap/{nameMap}")]
        public IActionResult GetMap(string nameMap)
        {
            if (!System.IO.File.Exists(currentPath + @"\wwwroot\MapsFolder\" + nameMap + ".png"))
            {
                return NotFound();
            }

            Byte[] map = System.IO.File.ReadAllBytes(currentPath+ @"\wwwroot\MapsFolder\" + nameMap+".png");     


            return File(map, "image/png");
        }

        [HttpGet("GetParallaxe/{nameMap}")]
        public IActionResult GetParallaxes(string nameMap)
        {
            IParallaxes parallaxes;

            if (nameMap == "Aspid")
            {
                parallaxes = new AspidParallax();
            }
            else if (nameMap == "Bagel")
            {
                parallaxes = new BagelParallax();
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

            Byte[] map = System.IO.File.ReadAllBytes(currentPath + @"\wwwroot\" + parallaxes.GetPath());

            return File(map, "image/png");
        }
    }

    struct JsonMap
    {
        public string Name { get; set; }

        public Extent Extent { get; set; }
    }
    struct Extent
    {
        public float X1 { get; set; }
        public float Y1 { get; set; }

        public float X2 { get; set; }
        public float Y2 { get; set; }
    }
}