'use strict';

const chai = require('chai');
chai.use(require('chai-as-promised'));
const { expect } = chai;

const globble = require('..');

describe('globble', () => {
    describe('with no given options', () => {
        it('resolves a collection', () => {
            const promise = globble('fixtures/foo.yml', { cwd: __dirname });
            return Promise.all([
                expect(promise).to.eventually.have.nested.property('[0].name', 'foo'),
                expect(promise).to.eventually.have.nested.property('[0].file'),
                expect(promise).to.eventually.have.nested.property('[0].data.foo', 'bar')
            ]);
        });
    });
    describe('with clobber option', () => {
        it('resolves to a map', () => {
            return expect(globble('fixtures/foo.yml', { clobber: true, cwd: __dirname })).to.eventually.eql({ foo: { foo: 'bar' } });
        });
    });
});

describe('globble.sync', () => {
    describe('with no given options', () => {
        it('returns a collection', () => {
            const data = globble.sync('fixtures/foo.yml', { cwd: __dirname });
            expect(data).to.have.nested.property('[0].name', 'foo');
            expect(data).to.have.nested.property('[0].file'),
            expect(data).to.have.nested.property('[0].data.foo', 'bar')
        });
    });
    describe('with clobber option', () => {
        it('returns to a map', () => {
            const data = globble.sync('fixtures/foo.yml', { clobber: true, cwd: __dirname });
            expect(data).to.eql({ foo: { foo: 'bar' } });
        });
    });
});
