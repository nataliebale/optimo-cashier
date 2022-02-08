using System;
using System.Collections.Generic;
using System.IO;
using System.Xml.Serialization;

namespace IngenicoCLS
{
    public class Document
    {
        public string DocumentNr = null;
        public List<Transaction> Transactions = new List<Transaction>();
        public Document.States State;

        public void GenerateNewUniqueDocumentNr()
        {
            this.DocumentNr = Guid.NewGuid().ToString("N").Substring(0, 20);
        }

        public string Serialize()
        {
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(Document));
            StringWriter stringWriter = new StringWriter();
            xmlSerializer.Serialize(stringWriter, this);
            stringWriter.Flush();
            return stringWriter.ToString();
        }

        public static Document Deserialize(string data)
        {
            return (Document)new XmlSerializer(typeof(Document)).Deserialize(new StringReader(data));
        }

        public bool IsClosed()
        {
            switch (this.State)
            {
                case Document.States.ToBeReversed:
                case Document.States.ToBeConfirmed:
                    return false;
                case Document.States.Reversed:
                case Document.States.Confirmed:
                    return true;
                default:
                    throw new Exception("Unknown state");
            }
        }

        public void ChangeStateToClosed()
        {
            switch (this.State)
            {
                case Document.States.ToBeReversed:
                    this.State = Document.States.Reversed;
                    break;
                case Document.States.ToBeConfirmed:
                    this.State = Document.States.Confirmed;
                    break;
            }
        }

        public enum States
        {
            ToBeReversed,
            Reversed,
            ToBeConfirmed,
            Confirmed,
        }
    }
}
