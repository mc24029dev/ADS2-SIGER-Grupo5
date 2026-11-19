-- Contraseña de prueba para administradores
UPDATE usuarios
SET contraseña = '$2a$12$MqQWAzgozOzrCGKMuqh6tOV3JlYrSmvp1VR6RfIaGofn8UGTENpZi'
WHERE id_usuario IN (1, 2);

-- Contraseña de prueba para organizadores
UPDATE usuarios
SET contraseña = '$2a$12$LpX4gOvX4K5qyarJ5cLlz.d24ifTVaHrYe8YoVbO/wzjfrkIJe9.a'
WHERE id_usuario IN (3, 4, 5);

-- Contraseña de prueba para participantes
UPDATE usuarios
SET contraseña = '$2a$12$3XLPyby5wMAXdrn0WF/xTOXpZosrIduP2kVxOa3jcVWKRlVEvwP4W'
WHERE id_usuario IN (6, 7, 8, 9, 10, 11, 12);