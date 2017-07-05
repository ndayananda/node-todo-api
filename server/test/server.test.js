const {ObjectID} = require('mongodb');
const request = require('supertest');
const expect = require('expect');

const {app} = require('../server');
const {Todo} = require('../models/todo.model');

const todos = [{
    _id: new ObjectID(),
    text: 'Test todo item 1'
}, {
    _id: new ObjectID(),
    text: 'Test todo item 2'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
});

describe('POST /todos', () => {
    it('Should create new todo item', (done) => {
        var text = 'Todo item for test';

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
                expect(res.body.completed).toBe(false);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos[todos.length - 1].text).toBe(text);
                    done();
                }).catch(err => done(err));
            });
    });

    it('Should validate for required filed to create todo item', (done) => {
        request(app)
            .post('/todos')
            .send()
            .expect(400)
            .end((err, res) => {
                done(err);
            });
    })
});

describe('GET /todos', () => {
    it('Should fetch all the todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toBe(true);
            })
            .end((err, res) => {
                if(err) return done(err);

                Todo.find().then((todos) => {
                    expect(res.body.data.length).toBe(todos.length);
                    done();
                });
            });
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
})