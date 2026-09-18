import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Clon de instagram',
        description: 'Un clon de instagram con funcionalidades básicas como registro, inicio de sesión, creación de publicaciones y visualización de perfiles de usuario.',
        version: '1.0.0'
    },
    host: 'localhost:3000',
    basePath: '/api',
    schemes: ['http'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: "Ingresá el token JWT (Swagger agrega 'Bearer ' automáticamente)"
        }
    },
    definitions: {
        UsuarioInput: {
            nombre_usuario: "usuario123",
            nombre_completo: "Nombre Completo",
            email: "usuario123@example.com",
            password: "contraseña123",
            biografia: "Biografía del usuario",
            foto_perfil: "url_de_la_foto"
        },
        PublicacionInput: {
            url_imagen: "url_de_la_imagen",
            descripcion: "Descripción de la publicación"
        },
        Perfil: {
            nombre_usuario: "usuario123",
            nombre_completo: "Nombre Completo",
            email: "usuario123@example.com",
            biografia: "Biografía del usuario",
            foto_perfil: "url_de_la_foto"
        },
        Publicacion: {
            id: 1,
            url_imagen: "url_de_la_imagen",
            descripcion: "Descripción de la publicación"
        }
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = [
    './src/routes/auth.js',
    './src/routes/publicaciones.js',
    './src/routes/user.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    import('./index.js');
});