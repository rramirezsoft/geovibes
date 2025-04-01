const request = require('supertest');
const app = require('../app');
const User = require('../models/nosql/user');

describe('Auth - Onboarding endpoints', () => {

    let accessToken = "";
    let verificationCode = "";
    let id = "";
    let adminId = "";

    // ENDPOINT: /api/auth/register

    // ✅ Caso 1: Registro exitoso con rol de usuario
    it('✔️ Should register a user successfully with user rol', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                "nickname": "User123",
                "email": "user123@test.com",
                "password": "Password123",
                "verificationCode": verificationCode
            })
            .set('Accept', 'application/json')
            .expect(201);
        
        expect(response.body.user.nickname).toEqual('user123');
        expect(response.body.user.email).toEqual('user123@test.com');
        expect(response.body.user.role).toEqual('user');

        accessToken = response.body.accessToken;
        id = response.body.user._id;
        verificationCode = response.body.user.verificationCode;
    });

    // ✅ Caso 2: Registro exitoso con rol de admin
    it('✔️ Should register a user successfully with admin rol', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                "nickname": "Admin123",
                "email": "admin123@test.com",
                "password": "Password123",
                "role": "admin"
            })
            .set('Accept', 'application/json')
            .expect(201);
        
        expect(response.body.user.nickname).toEqual('admin123');
        expect(response.body.user.email).toEqual('admin123@test.com');
        expect(response.body.user.role).toEqual('admin');

        adminId = response.body.user._id;
    });

    // ✅ Caso 3: Nickname duplicado
    it('❌ Should fail if nickname is already in use', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                "nickname": "User123", // Mismo nickname del caso anterior
                "email": "newemail@test.com",
                "password": "Password123"
            })
            .set('Accept', 'application/json')
            .expect(409);
        
        expect(response.body.message).toEqual('NICKNAME_ALREADY_EXISTS');
    });

    // ✅ Caso 4: Email duplicado
    it('❌ Should fail if email is already in use', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                "nickname": "NewUser123",
                "email": "user123@test.com", // Mismo email del caso exitoso
                "password": "Password123"
            })
            .set('Accept', 'application/json')
            .expect(409);
        
        expect(response.body.message).toEqual('EMAIL_ALREADY_EXISTS');
    });

    // ✅ Caso 5: Formato de email inválido
    it('❌ Should fail if email format is invalid', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                "nickname": "InvalidEmailUser",
                "email": "invalidemail", // Sin formato válido
                "password": "Password123"
            })
            .set('Accept', 'application/json')
            .expect(422);
        
        expect(response.body.errors[0].msg).toContain('El email no es válido');
    });

    // ✅ Caso 6: Contraseña muy corta
    it('❌ Should fail if password is too short', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                "nickname": "ShortPassUser",
                "email": "shortpass@test.com",
                "password": "12345" // Menos de 8 caracteres
            })
            .set('Accept', 'application/json')
            .expect(422);
        
        expect(response.body.errors[0].msg).toContain('La contraseña debe tener entre 8 y 16 caracteres');
    });

    // ✅ Caso 7: Nickname con caracteres no permitidos
    it('❌ Should fail if nickname has invalid characters', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                "nickname": "Invalid@Name",
                "email": "invalidname@test.com",
                "password": "Password123"
            })
            .set('Accept', 'application/json')
            .expect(422);
        
        expect(response.body.errors[0].msg).toContain('Solo se permiten letras, números y guiones bajos');
    });

    // ✅ Caso 8: Faltan campos obligatorios
    it('❌ Should fail if required fields are missing', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                "nickname": "MissingFieldsUser"
                // Falta email y password
            })
            .set('Accept', 'application/json')
            .expect(422);
        
        expect(response.body.errors).toHaveLength(6);
    });

    // ENDPOINT: /api/auth/validate

    // ✅ Caso 1: Validación exitosa de email del usuario (pruebas)
    it('✔️ Should validate email successfully', async () => {
        console.log("Token before validation:", accessToken);
        const response = await request(app)
            .put('/api/auth/validate')
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', `application/json`)
            .send({ "verificationCode": verificationCode })
            .expect(200);
        
        expect(response.body.message).toEqual("EMAIL_VERIFIED_SUCCESSFULLY");
    });

    afterAll(async () => {
        await User.findByIdAndDelete(id); 
        await User.findByIdAndDelete(adminId);
        
    });
    
});
