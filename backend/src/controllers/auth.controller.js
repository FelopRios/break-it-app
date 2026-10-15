const { auth, db } = require("../config/firebase");

const registerUser = async (req, res) => {
    try {
        const { email, password, displayName = " " } = req.body;

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

        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: displayName
        });

        currentTimestamp = new Date().toISOString();

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

        await db.collection('users').doc(userRecord.uid).set(userDoc);

        return res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: userDoc
        });

    } catch (error) {
        console.error("Error al registrar usuario:", error);

        if (error.code === 'auth/email-already-exists') {
            return res.status(409).json({
                error: 'Conflict',
                message: "El correo electrónico ya está en uso por otra cuenta."
            });
        }

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

        return res.status(500).json({
            error: 'Internal Server Error',
            message: "Ocurrió un error al registrar el usuario.",
            details: error.message
        });
    }
};

const loginTest = (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Endpoint de login alcanzado correctamente",
        timestamp: new Date().toISOString()
    });
};

module.exports = { registerUser, loginTest };