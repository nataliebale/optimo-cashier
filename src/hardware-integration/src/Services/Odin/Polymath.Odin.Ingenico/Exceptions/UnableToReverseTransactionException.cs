using System;

namespace Polymath.Odin.Ingenico.Exceptions
{
    public class UnableToReverseTransactionException : Exception
    {
        public UnableToReverseTransactionException()
        {
        }

        public UnableToReverseTransactionException(string message) : base(message)
        {
        }
    }
}
