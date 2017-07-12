const {ObjectID} = require('mongodb');
const request = require('supertest');
const expect = require('expect');

const {app} = require('../server');
const {Todo} = require('../models/todo.model');
const {User} = require('../models/user.model');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('Should create new todo item', (done) => {
        var text = 'Todo item for test';

        request(app)
            .post('/todos')
            .send({
                text
            })
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
                expect(res.body.completed).toBe(false);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById({
                    _id: res.body._id
                }).then((todo) => {
                    expect(todo._creator).toBe(users[0]._id);
                    done();
                }).catch(err => done(err));
            });
    });

    it('Should return 400 if required field is not sent to create todo item', (done) => {
        request(app)
            .post('/todos')
            .send()
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end((err, res) => {
                done(err);
            });
    });

    it('Should create todo item only if user is authenticated', (done) => {
        var text = 'Todo item 2 for test';

        request(app)
            .post('/todos')
            .send({text})
            .expect(401)
            .end((err, res) => {
                done(err);
            });
    });
});

describe('GET /todos', () => {
    it('Should fetch all the todos created by logged in user', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toBe(true);
            })
            .end((err, res) => {
                if(err) return done(err);

                Todo.find({
                    _creator: users[0]._id
                }).then((todos) => {
                    expect(res.body.data.length).toBe(todos.length);
                    done();
                });
            });
    });

    it('Should return 401 unautherised if user is unathenticated', (done) => {
        request(app)
            .get('/todos')
            .expect(401)
            .end(() => done());
    });

    it('Should get the matching document', (done) => {
        var id = todos[0]._id.toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data._id).toBe(id);
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                
                done();
            });
    });

    it('Should not get the document if not available', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toBe(false);
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                
                done();
            });
    });

    it('Should throw error if the id is invalid', (done) => {
        var id = '595264841604f91d8c82bc95AD';
        request(app)
            .get(`/todos/${id}`)
            .expect(400)
            .end((err, res) => {
                done(err);
            });
    });
});

describe('DELETE /todos', () => {
    it('Should delete a todo', (done) => {
        var id = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data._id).toBe(id);
            })
            .end((err, res) => {
                if(err)
                    return done(err);

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((err) => done(err));
            })
    });

    it('Should return 404 if document not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end((err) => done(err))
    });

    it('Should return 404 if id is invalid', (done) => {
        var id = new ObjectID().toHexString()+'AB';
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end((err) => done(err))
    });
});

describe('UPDATE /todos:id', () => {
    it('Should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({
                _id: '132233',
                text: 'Test todo item 1 updated',
                completed: false,
                completedAt: '233243234'
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data._id).toBe(id)
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                
                Todo.findById(id).then((todo) => {
                    expect(todo).toExist(res.body.data);
                    done();
                }).catch((err) => done(err));
            });
    });

    it('Should return 404 if todo does not exist', (done) => {
        var id = new ObjectID().toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .expect(404)
            .end((err) => done(err))
    });

    it('Should return 404 if id is invalid', (done) => {
        var id = new ObjectID().toHexString() + 'AD';

        request(app)
            .patch(`/todos/${id}`)
            .expect(404)
            .end((err) => done(err))
    });
});

describe('GET /users/me', () => {
    it('Should return a user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data._id).toBe(user[0]._id);
                expect(res.body.data.email).toBe(user[0].email);
            })
            .end(() => done());
    });

    it('Should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(() => done());
    });
});

describe('POST /Login', () => {
    it('Should authenticate user and return valid JWT token', (done) => {
        request(app)
            .post('/login')
            .send({
                email: users[0].email,
                password: users[0].password
            })
            .expect(200)
            .expect('x-auth', users[0].tokens[0].token)
            .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data._id).toBe(users[0]._id);
                expect(res.body.data.email).toBe(users[0].email);
            })
            .end(() => done())
    });

    it('Should return 401 unautherised if password is missing', (done) => {
        request(app)
            .post('/login')
            .send({
                email: users[0].email
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.success).toBe(false);
            })
            .end(() => done())
    });

    it('Should return 401 unautherised if email is missing', (done) => {
        request(app)
            .post('/login')
            .send({
                password: users[0].password
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.success).toBe(false);
            })
            .end(() => done())
    });

    it('Should return 401 unautherised if email is wrong', (done) => {
        request(app)
            .post('/login')
            .send({
                email: 'naven@example.com',
                password: users[0].password
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.success).toBe(false);
            })
            .end(() => done())
    });

     it('Should return 401 unautherised if password is wrong', (done) => {
        request(app)
            .post('/login')
            .send({
                email: users[0].email,
                password: users[0].password+'!'
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.success).toBe(false);
            })
            .end(() => done())
    });
});

describe('DELETE /users/me/token', () => {
    it('Should authenticate the user and logout if authenticated', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toBe(true);
            })
            .end((err, res) => {
                if(err)
                    return done(err);

                User.findOne({
                    email: users[0].email
                }).then((user) => {
                    if(!user)
                        return Promise.reject()

                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => done(err))
            })
    });

    it('Should return 400 if token is invalid', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end(() => done())
    });
})