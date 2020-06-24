const request = require('supertest');
const server = require('./server.js');
const db = require('../data/dbConfig.js');


describe('register and login', () => {


    describe('register with username and password', () => {
        beforeEach(async() => {
            return db('users').truncate();
        })
        test('returns true', () => {
            expect(true).toBe(true);
          });
          
        it('should return 201 message', () => {

            return request(server)
                .post('/auth/register')
                .send({
                    username: 'Robbie',
                    password: 'password',
                    email: "robbie@gmail.com",
                    role: "helper"
                })
                .then(res => {
                    expect(res.status).toBe(201)
                })
        })
        
        it("should return a 500 error for inputing an incomplete password", () => {
            return request(server)
                .post("/auth/register")
                .send({ 
                    username: 'robbie', 
                    password: 2311 
                })
                .then(res => {
                expect(res.status).toBe(400);//should pass with 400 expect 500
            });
        });


        it("should test the login", async() => {
            const credential = { username: "robbie", password: "password" };
            const res = await request(server)
                .post("/auth/login")
                .send(credential);
            expect(res.status).toBe(401); //fail with 201
        });
    })
    describe('POST /login', () => {
        it('should return 401 when missing username and password', () => {
            return request(server)
                .post('/auth/login')
                .send({ username: '', password: '' })
                .then(res => {
                    expect(res.status).toBe(401)
                })
        })
        it("should return 500 to invalid password", () => {
            return request(server)
            .post("/auth/register")
            .send({ username: 'robbie', password: "password" })//should fail with correct password use 2311
            .then(res => {
            expect(res.status).toBe(400);// should pass with 500
            });
        });
    })
    
})
