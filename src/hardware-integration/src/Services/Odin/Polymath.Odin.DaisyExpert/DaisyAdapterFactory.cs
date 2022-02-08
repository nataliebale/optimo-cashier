namespace Polymath.Odin.DaisyExpert
{
    public class DaisyAdapterFactory
    {
        public static IDaisyExpertAdapter GetDaisy(string port)
        {
            return new DaisyExpertAdapterNew(port);
        }
    }
}
