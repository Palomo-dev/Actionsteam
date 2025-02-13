import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectTitleSection } from "@/components/settings/ProjectTitleSection";
import { ImageUploadSection } from "@/components/settings/ImageUploadSection";

export const SettingsGeneral = () => {
  const [currentFavicon, setCurrentFavicon] = useState("/favicon.ico");
  const [currentCover, setCurrentCover] = useState("/og-image.png");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProjectTitleSection initialTitle="Imagine AI" />
        
        <div className="border p-4 rounded-lg bg-muted/50">
          <ImageUploadSection
            label="Favicon del sitio"
            currentImage={currentFavicon}
            type="favicon"
            onImageUpdate={setCurrentFavicon}
          />
          <p className="text-sm text-muted-foreground mt-2">
            El favicon es el ícono que aparece en la pestaña del navegador. Se recomienda una imagen cuadrada de 32x32 píxeles.
          </p>
        </div>
        
        <ImageUploadSection
          label="Imagen de Portada"
          currentImage={currentCover}
          type="cover"
          onImageUpdate={setCurrentCover}
        />
      </CardContent>
    </Card>
  );
};