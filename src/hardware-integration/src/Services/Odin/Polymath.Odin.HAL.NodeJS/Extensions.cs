using Newtonsoft.Json;

namespace Polymath.Odin.HAL.NodeJS
{
    public static class Extensions
    {
        public static T ForceType<T>(this object o)
            => JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(o));
    }
}
