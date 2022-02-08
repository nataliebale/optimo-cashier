using System.Collections.Generic;
using System.IO;

namespace IngenicoCLS
{
    public class DocumentManager
    {
        public static List<Document> GetAllDocuments()
        {
            List<Document> documentList = new List<Document>();
            foreach (string file in Directory.GetFiles(Ingenico.DOC_PATH, "*.docXml", SearchOption.TopDirectoryOnly))
            {
                try
                {
                    if (file.EndsWith(".docXml"))
                    {
                        Document document = Document.Deserialize(File.ReadAllText(file));
                        documentList.Add(document);
                    }
                }
                catch
                {
                }
            }
            return documentList;
        }

        public static void SaveDocument(Document doc)
        {
            File.WriteAllText(Ingenico.DOC_PATH + doc.DocumentNr + ".docXml", doc.Serialize());
        }

        public static void DeleteDocument(Document doc)
        {
            string path = Ingenico.DOC_PATH + doc.DocumentNr + ".docXml";
            if (!File.Exists(path))
                return;
            File.Delete(path);
        }
    }
}
