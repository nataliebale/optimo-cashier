using System;

namespace Polymath.Odin.HAL.Exceptions
{
    public class DaisyExpertNotConnectedException : Exception
    {
        public DaisyExpertNotConnectedException(string message) : base(message)
        {
        }
    }
}
