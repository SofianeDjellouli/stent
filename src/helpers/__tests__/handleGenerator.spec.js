import handleGenerator from '../handleGenerator';
import { call } from '../';

describe('Given the handleGenerator helper', function () {
  describe('when we run the same generator again', function () {
    describe('and we want to cancel the first one', function () {
      it('should cancel the second generator', function (done) {
        const testCases = [
          { timeout: 20, answer: 'a'},
          { timeout: 10, answer: 'b'}
        ];
        const delay = ({ timeout, answer }) => new Promise(resolve => {
          setTimeout(() => resolve(answer), timeout);
        });
        const onGeneratorEnds = sinon.spy();
        const generator = function * () {
          return yield call(function * () {
            return yield call(() => delay(testCases.shift()));
          });
        }

        const cancel = handleGenerator({}, generator(), onGeneratorEnds);
        handleGenerator({}, generator(), onGeneratorEnds);
        cancel();

        setTimeout(function () {
          expect(onGeneratorEnds).to.be.calledOnce.and.to.be.calledWith('b');
          done();
        }, 30);
      });
    });
  });
  
  it("should catch errors in the function result of the call helper", function () {
    const mistake = () => {
      throw new Error("oops");
    };

    const generator = function* () {
      try {
        yield call(mistake);
      } catch (err) {
        return yield call(() => err.message);
      }
    };

    handleGenerator({}, generator(), (result) =>
      expect(result).to.be.equal("oops")
    );
  });
});