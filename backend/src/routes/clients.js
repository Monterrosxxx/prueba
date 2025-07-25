// Ruta: backend/src/routes/clients.js (AGREGAR estas líneas al archivo existente)

// Importar Express para crear el enrutador
import express from "express";
// Importar el controlador de clientes
import clientsController from "../controllers/clientsController.js";
// NUEVO: Importar middleware de autenticación
import verifyToken from "../middlewares/validateAuthToken.js";
// NUEVO: Importar multer para manejo de archivos
import multer from "multer";

// NUEVO: Configuración de multer para subida de imágenes de perfil
const upload = multer({
    dest: "profile_pictures/",
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
    },
    fileFilter: (req, file, cb) => {
        // Validar tipo de archivo
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    }
});

// Crear una instancia del enrutador de Express
const router = express.Router();

// Ruta para obtener estadísticas de nuevos clientes
// GET /newClientsStats - Obtener métricas sobre registros de nuevos clientes
router.get("/newClientsStats", clientsController.getNewClientsStats);

// Ruta para obtener el total de clientes
// GET /total - Obtener el número total de clientes registrados
router.get("/total", clientsController.getTotalClients);

// NUEVA RUTA: Actualizar perfil del usuario autenticado
// PUT /update-profile - Actualizar información personal y foto de perfil
router.put("/update-profile", verifyToken, upload.single('profilePicture'), clientsController.updateProfile);

// Ruta adicional para estadísticas detalladas (si existe la función)
router.get("/detailedStats", (req, res) => {
    // Verificar si la función existe antes de llamarla
    if (typeof clientsController.getDetailedClientsStats === 'function') {
        return clientsController.getDetailedClientsStats(req, res);
    } else {
        // Si no existe, devolver estadísticas básicas
        return res.status(200).json({
            success: true,
            message: "Función de estadísticas detalladas no implementada",
            data: {}
        });
    }
});

// Exportar el enrutador para ser usado en la aplicación principal
export default router;