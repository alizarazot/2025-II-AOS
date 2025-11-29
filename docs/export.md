# Exportación de datos

La aplicación le permite exportar datos en XSLX (Excel) & PDF.

Para esto se utilizaron las librerías `react-pdf` & `exceljs`.

## Proceso de exportación

Al momento de presionar algún botón de descarga, el sistema:

1. Vuelve a cargar toda la información desde Firestore (para asegurarse de que los datos sean recientes).
2. Renderiza los datos utilizando los métodos específicos de la librería correspondiente.
3. Generar el archivo en un BLOB (una vez más, siguiendo los métodos específicos de las librerías).
4. Generar una URL para el BLOB y enviar el usuario a esa URL, lo cuál inicia la descarga.
