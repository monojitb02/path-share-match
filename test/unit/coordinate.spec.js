const { expect } = require('chai');
const Coordinates = require('../../src/Coordinates');
describe('Coordinates class tests', () => {
    it('getDistance should give correct result', () => {
        const c1 = new Coordinates(17.4288417, 78.333635);
        const c2 = new Coordinates(17.4307985, 78.3501153);
        expect(c1.getDistance(c2)).to.be.eql(1.762);
    });
    it('getDistance should give correct result', () => {
        const c1 = new Coordinates(17.0000, 78.000000);
        const c2 = new Coordinates(17.1000, 78.000000);
        expect(c1.getDistance(c2)).to.be.eql(11.119);
    });
    it('getDistance should give correct result', () => {
        const c1 = new Coordinates(17.0000, 78.0000);
        const c2 = new Coordinates(17.0000, 78.1000);
        expect(c1.getDistance(c2)).to.be.eql(10.634);
    });


    it.skip('getDistance2 should give correct result', () => {
        const c1 = new Coordinates(17.4288417, 78.333635);
        const c2 = new Coordinates(17.4307985, 78.3501153);
        expect(c1.getDistance2(c2)).to.be.eql(1.762);
    });
    it.skip('getDistance2 should give correct result', () => {
        const c1 = new Coordinates(17.0000, 78.000000);
        const c2 = new Coordinates(17.1000, 78.000000);
        expect(c1.getDistance2(c2)).to.be.eql(11.119);
    });
    it('getDistance2 should give correct result', () => {
        const c1 = new Coordinates(17.0000, 78.0000);
        const c2 = new Coordinates(17.0000, 78.1000);
        expect(c1.getDistance2(c2)).to.be.eql(10.634);
    });
    it('getDistance2 vs getDistance2 should give correct result', () => {
        const c1 = new Coordinates(26.213984,78.181543);
        const c2 = new Coordinates(27.249893,78.177031);
        expect(c1.getDistance2(c2)-c1.getDistance(c2)).to.be.eql(0);
    });
});
describe('Coordinates class tests', () => {
    it('getDistance should give correct result', () => {
        const c1 = new Coordinates(17.4288417, 78.333635);
        const c2 = new Coordinates(17.4307985, 78.3501153);
        expect(c1.getDistance(c2)).to.be.eql(1.762);
    });
    it('getDistance should give correct result', () => {
        const c1 = new Coordinates(17.0000, 78.000000);
        const c2 = new Coordinates(18.0000, 78.000000);
        expect(c1.getDistance(c2)).to.be.eql(111.195);
    });
    it('getDistance should give correct result', () => {
        const c1 = new Coordinates(17.0000, 78.0000);
        const c2 = new Coordinates(17.0000, 79.0000);
        expect(c1.getDistance(c2)).to.be.eql(106.336);
    });


    it('getDistance2 should give correct result', () => {
        const c1 = new Coordinates(17.4288417, 78.333635);
        const c2 = new Coordinates(17.4307985, 78.3501153);
        expect(c1.getDistance2(c2)).to.be.eql(1.766);
    });
    it('getDistance2 should give correct result', () => {
        const c1 = new Coordinates(17.0000, 78.000000);
        const c2 = new Coordinates(18.0000, 78.000000);
        expect(c1.getDistance2(c2)).to.be.eql(111.195);
    });
    it('getDistance2 should give correct result', () => {
        const c1 = new Coordinates(17.0000, 78.0000);
        const c2 = new Coordinates(17.0000, 79.0000);
        expect(c1.getDistance2(c2)).to.be.eql(106.336);
    });
    it('getDistance vs getDistance2 should give correct result', () => {
        const c1 = new Coordinates(26.213984,78.181543);
        const c2 = new Coordinates(27.249893,78.177031);
        expect(c1.getDistance2(c2)-c1.getDistance(c2)).to.be.eql(0);
    });
});