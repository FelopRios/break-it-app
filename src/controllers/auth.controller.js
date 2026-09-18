const { auth, db } = require("../config/firebase");

const registerUser = async (req, res) => {
    try {
        const { email, password, displayName = " " } = req.body;

        //Validacion de entrada basico
        if (!email || !password) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "Correo y contraseña son obligatorios"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        //crear el usuario en firebase authentication
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: displayName
        });

        currentTimestamp = new Date().toISOString();

        //crear el documento del usuario en Firestore
        const userDoc = {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName || "",
            authProvider: "password",
            preferences: {
                notificationsEnabled: "true",
                dailyReminderTime: "09:00",
                theme: "system"
            },
            deviceTokens: [],
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
            lastLoginAt: currentTimestamp,
        };

        // Usamos el UID generado por Auth como ID del documento en Firestore
        await db.collection('users').doc(userRecord.uid).set(userDoc);

        // Crear una respuesta mas limpia
        return res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: userDoc
        });

    } catch (error) {
        console.error("Error al registrar usuario:", error);

        // Manejo de errores específicos de Firebase Admin SDK
        if (error.code === 'auth/email-already-exists') {
            return res.status(409).json({
                error: 'Conflict',
                message: "El correo electrónico ya está en uso por otra cuenta."
            });
        }

        //Manejo de errores de formato (debido a las validaciones de entrada)
        if (error.code === 'auth/invalid-email') {
            return res.status(400).json({
                error: 'Bad Request',
                message: "El formato del correo electrónico es inválido."
            });
        }

        if (error.code === 'auth/invalid-password') {
            return res.status(400).json({
                error: 'Bad Request',
                message: "La contraseña es invalida."
            });
        }

        // Fallback para errores de escritura en Firestore u otros no controlados
        return res.status(500).json({
            error: 'Internal Server Error',
            message: "Ocurrió un error al registrar el usuario.",
            details: error.message
        });
    }
};

module.exports = { registerUser };