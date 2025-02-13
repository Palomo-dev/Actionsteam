import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface SessionDocumentProps {
  documentUrl: string | null | undefined;
  documentFile: File | null | undefined;
  onDocumentChange: (file: File | null) => void;
  onDocumentUrlChange: (url: string | null) => void;
}

export const SessionDocument = ({
  documentUrl,
  documentFile,
  onDocumentChange,
  onDocumentUrlChange,
}: SessionDocumentProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onDocumentChange(file);
      toast.success("Documento seleccionado correctamente");
    }
  };

  const handleRemoveDocument = () => {
    onDocumentChange(null);
    onDocumentUrlChange(null);
    toast.success("Documento eliminado correctamente");
  };

  // Verificar si hay un documento (ya sea archivo o URL)
  const hasDocument = documentFile || documentUrl;
  console.log("Document URL:", documentUrl); // Para debugging

  return (
    <div className="space-y-2">
      <Label>Documentación</Label>
      <div className="space-y-2">
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="pl-10"
          />
        </div>

        <Card className="overflow-hidden bg-[#0f1116] border-0">
          {hasDocument ? (
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                {documentFile ? 
                  `Archivo seleccionado: ${documentFile.name}` :
                  `Documento actual: ${documentUrl?.split('/').pop()}`
                }
              </p>
              <div className="flex gap-2">
                {documentUrl && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        Ver documento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[80vh]">
                      <iframe
                        src={documentUrl}
                        className="w-full h-full rounded-md"
                        title="Document Preview"
                      />
                    </DialogContent>
                  </Dialog>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleRemoveDocument}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <FileText className="h-12 w-12 mb-4" />
              <p>No hay documento cargado</p>
              <p className="text-sm">Sube un documento para esta sesión</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};