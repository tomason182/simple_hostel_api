import multer from "multer";

export default function uploadImages() {
  const upload = multer({ dest: '../../temp-uploads-photos/' }); // Carpeta temporal para almacenar imágenes
  return upload; 
}