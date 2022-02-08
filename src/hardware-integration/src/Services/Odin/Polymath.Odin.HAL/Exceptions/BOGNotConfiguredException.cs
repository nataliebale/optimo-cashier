using System;

namespace Polymath.Odin.HAL.Exceptions
{
    class BOGNotConfiguredException : Exception
    {
        public BOGNotConfiguredException()
        {
        }

        public BOGNotConfiguredException(string message) : base(message)
        {
        }
    }
}
