import multer from "multer";

export const upload = multer({ dest: '../../temp-uploads-photos/' }); // Carpeta temporal para almacenar imágenes

//export default? const upload = ....