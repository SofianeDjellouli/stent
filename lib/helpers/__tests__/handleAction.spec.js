'use strict';

var _handleAction = require('../handleAction');

var _handleAction2 = _interopRequireDefault(_handleAction);

var _constants = require('../../constants');

var _ = require('../');

var _2 = require('../../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Given the handleAction function', function () {
  beforeEach(function () {
    _2.Machine.flush();
  });

  describe('when we add a handler which is not expected', function () {
    it('should throw an error', function () {
      var machine = {
        state: { name: 'idle' },
        transitions: {
          idle: { run: 42 },
          running: { stop: 'foo' }
        }
      };

      expect(_handleAction2.default.bind(null, machine, 'run')).to.throw(_constants.ERROR_NOT_SUPPORTED_HANDLER_TYPE);
    });
  });

  describe('when dispatching an action which is missing in the current state', function () {
    it('should silently do nothing and NOT throw an error (handleAction returns false)', function () {
      var machine = {
        state: { name: 'idle' },
        transitions: {
          idle: { run: 'running' },
          running: { stop: 'foo' }
        }
      };

      expect((0, _handleAction2.default)(machine, 'stop', 'a', 'b')).to.equal(false);;
    });
  });

  describe('when there is nothing for the current state', function () {
    it('should return false', function () {
      var machine = {
        state: { name: 'idle' },
        transitions: {
          foo: {}
        }
      };

      expect((0, _handleAction2.default)(machine, 'something')).to.be.false;
    });
  });

  describe('when we transition to a state which has no actions or it is undefined', function () {
    it('should throw an error if there is no such a state defined', function () {
      var machine = {
        state: { name: 'idle' },
        transitions: {
          idle: {
            'run': 'running'
          }
        }
      };

      expect(_handleAction2.default.bind(null, machine, 'run')).to.throw((0, _constants.ERROR_UNCOVERED_STATE)('running'));
    });
    it('should throw an error if there the state has no actions inside', function () {
      var machine = {
        state: { name: 'idle' },
        transitions: {
          idle: {
            'run': 'running'
          },
          running: {}
        }
      };

      expect(_handleAction2.default.bind(null, machine, 'run')).to.throw((0, _constants.ERROR_UNCOVERED_STATE)('running'));
    });
  });

  describe('when the handler is a string', function () {
    it('should change the state of the machine to that string', function () {
      var machine = {
        state: { name: 'idle' },
        transitions: {
          idle: { run: 'running' },
          running: { stop: 'idle' }
        }
      };

      (0, _handleAction2.default)(machine, 'run');
      expect(machine.state.name).to.equal('running');
    });
  });

  describe('when the handler is an object', function () {
    it('should change the state of the machine to that object', function () {
      var newState = { name: 'running', answer: 42 };
      var machine = {
        state: { name: 'idle' },
        transitions: {
          idle: { run: newState },
          running: { stop: 'idle' }
        }
      };

      (0, _handleAction2.default)(machine, 'run');
      expect(machine.state).to.deep.equal(newState);
    });
  });

  describe('when the handler is a function', function () {
    it('should call the handler with the machine and the given payload', function () {
      var handler = sinon.spy();
      var payload = ['foo', 'bar', 'baz'];
      var machine = {
        state: { name: 'idle' },
        transitions: {
          idle: { run: handler },
          running: { stop: 'idle' }
        }
      };

      _handleAction2.default.apply(undefined, [machine, 'run'].concat(payload));
      expect(handler).to.be.calledOnce.and.to.be.calledWith(machine, 'foo', 'bar', 'baz');
    });
    it('should update the state', function () {
      var handler = function handler(state, payload) {
        return { name: 'bar', data: payload };
      };
      var machine = {
        state: { name: 'idle' },
        transitions: {
          idle: { run: handler },
          bar: { a: 'b' }
        }
      };

      (0, _handleAction2.default)(machine, 'run', 42);
      expect(machine.state).to.deep.equal({ name: 'bar', data: 42 });
    });
    it('should update the state even if a string is returned', function () {
      var handler = function handler(state, payload) {
        return 'bar';
      };
      var machine = {
        state: { name: 'idle', data: 42 },
        transitions: {
          idle: { run: handler },
          bar: { a: 'b' }
        }
      };

      (0, _handleAction2.default)(machine, 'run');
      expect(machine.state).to.deep.equal({ name: 'bar' });
    });
  });

  describe('when the handler is a generator', function () {
    it('should change the state if we return a string', function () {
      var handler = /*#__PURE__*/regeneratorRuntime.mark(function handler() {
        return regeneratorRuntime.wrap(function handler$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return 'foo';

              case 2:
                _context.next = 4;
                return 'bar';

              case 4:
                return _context.abrupt('return', 'running');

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, handler, this);
      });
      var machine = {
        state: { name: 'idle', data: 42 },
        transitions: {
          idle: { run: handler },
          foo: { a: 'b' },
          bar: { a: 'b' },
          running: { a: 'b' }
        }
      };

      (0, _handleAction2.default)(machine, 'run');
      expect(machine.state.name).to.equal('running');
    });
    it('should change the state if we yield a primitive', function () {
      var handler = /*#__PURE__*/regeneratorRuntime.mark(function handler() {
        return regeneratorRuntime.wrap(function handler$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return 100;

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, handler, this);
      });
      var machine = {
        state: { name: 'idle', data: 42 },
        transitions: {
          idle: { run: handler },
          '100': { a: 'b' }
        }
      };

      (0, _handleAction2.default)(machine, 'run');
      expect(machine.state.name).to.equal('100');
    });
    it('should change the state if we yield an object', function () {
      var handler = /*#__PURE__*/regeneratorRuntime.mark(function handler() {
        return regeneratorRuntime.wrap(function handler$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return { name: 'running', data: 12 };

              case 2:
                _context3.next = 4;
                return { name: 'jumping', data: 1 };

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, handler, this);
      });
      var machine = {
        state: { name: 'idle', data: 42 },
        transitions: {
          idle: { run: handler },
          running: { a: 'b' },
          jumping: { a: 'b' }
        }
      };

      (0, _handleAction2.default)(machine, 'run');
      expect(machine.state).to.deep.equal({ name: 'jumping', data: 1 });
    });

    describe('and we use the call helper', function () {
      it('should execute the function', function () {
        var foo = null;
        var api = function api(name) {
          foo = 'bar';
        };
        var handler = /*#__PURE__*/regeneratorRuntime.mark(function handler() {
          return regeneratorRuntime.wrap(function handler$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return (0, _.call)(api);

                case 2:
                  return _context4.abrupt('return', '...');

                case 3:
                case 'end':
                  return _context4.stop();
              }
            }
          }, handler, this);
        });
        var machine = {
          state: { name: 'idle', data: 42 },
          transitions: {
            idle: { run: handler },
            '...': { a: 'b' }
          }
        };

        (0, _handleAction2.default)(machine, 'run');
        expect(foo).to.deep.equal('bar');
        expect(machine.state).to.deep.equal({ name: '...' });
      });
      it('should execute the function and return the result if any', function () {
        var api = function api(name) {
          return 'hello ' + name;
        };
        var handler = /*#__PURE__*/regeneratorRuntime.mark(function handler() {
          var newState;
          return regeneratorRuntime.wrap(function handler$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return (0, _.call)(api, 'stent');

                case 2:
                  newState = _context5.sent;
                  return _context5.abrupt('return', newState);

                case 4:
                case 'end':
                  return _context5.stop();
              }
            }
          }, handler, this);
        });
        var machine = {
          state: { name: 'idle', data: 42 },
          transitions: {
            idle: { run: handler },
            'hello stent': 'a'
          }
        };

        (0, _handleAction2.default)(machine, 'run');
        expect(machine.state).to.deep.equal({ name: 'hello stent' });
      });
      it('should execute the function with proper parameters', function () {
        var api = function api(name, answer) {
          return Promise.resolve(name + '.' + answer);
        };
        var handler = /*#__PURE__*/regeneratorRuntime.mark(function handler() {
          return regeneratorRuntime.wrap(function handler$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return (0, _.call)(api, 'stent', 42);

                case 2:
                  return _context6.abrupt('return', _context6.sent);

                case 3:
                case 'end':
                  return _context6.stop();
              }
            }
          }, handler, this);
        });
        var machine = {
          state: { name: 'idle', data: 42 },
          transitions: {
            idle: { run: handler },
            'stent.42': 'a'
          }
        };

        (0, _handleAction2.default)(machine, 'run');
        return Promise.resolve().then(function () {
          expect(machine.state).to.deep.equal({ name: 'stent.42' });
        });
      });
      describe('and when the function returns a promise', function () {
        it('should return the value of the resolved promise', function () {
          var api = function api(name) {
            return Promise.resolve('hello ' + name);
          };
          var handler = /*#__PURE__*/regeneratorRuntime.mark(function handler() {
            var newState;
            return regeneratorRuntime.wrap(function handler$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return (0, _.call)(api, 'stent');

                  case 2:
                    newState = _context7.sent;
                    return _context7.abrupt('return', newState);

                  case 4:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, handler, this);
          });
          var machine = {
            state: { name: 'idle', data: 42 },
            transitions: {
              idle: { run: handler },
              'hello stent': 'a'
            }
          };

          (0, _handleAction2.default)(machine, 'run');
          return Promise.resolve().then(function () {
            expect(machine.state).to.deep.equal({ name: 'hello stent' });
          });
        });
        it('should throw an error if the promise is rejected', function () {
          var api = function api(name) {
            return Promise.reject('error ' + name);
          };
          var handler = /*#__PURE__*/regeneratorRuntime.mark(function handler() {
            var _newState;

            return regeneratorRuntime.wrap(function handler$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.prev = 0;
                    _context8.next = 3;
                    return (0, _.call)(api, 'stent');

                  case 3:
                    _newState = _context8.sent;
                    _context8.next = 9;
                    break;

                  case 6:
                    _context8.prev = 6;
                    _context8.t0 = _context8['catch'](0);
                    return _context8.abrupt('return', _context8.t0);

                  case 9:
                    return _context8.abrupt('return', newState);

                  case 10:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, handler, this, [[0, 6]]);
          });
          var machine = {
            state: { name: 'idle', data: 42 },
            transitions: {
              idle: { run: handler },
              'error stent': 'a'
            }
          };

          (0, _handleAction2.default)(machine, 'run');
          return Promise.resolve().then(function () {
            expect(machine.state).to.deep.equal({ name: 'error stent' });
          });
        });
      });
      describe('when the function returns another generator', function () {
        it('should iterate through that inner generator', function () {
          var api = /*#__PURE__*/regeneratorRuntime.mark(function api(name) {
            return regeneratorRuntime.wrap(function api$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return 42;

                  case 2:
                    _context9.next = 4;
                    return (0, _.call)(function () {
                      return Promise.resolve(name + ': merry christmas');
                    });

                  case 4:
                    return _context9.abrupt('return', _context9.sent);

                  case 5:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, api, this);
          });
          var handler = /*#__PURE__*/regeneratorRuntime.mark(function handler() {
            return regeneratorRuntime.wrap(function handler$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _context10.next = 2;
                    return (0, _.call)(api, 'stent');

                  case 2:
                    return _context10.abrupt('return', _context10.sent);

                  case 3:
                  case 'end':
                    return _context10.stop();
                }
              }
            }, handler, this);
          });
          var machine = {
            state: { name: 'idle', data: 42 },
            transitions: {
              idle: { run: handler },
              '42': 'a',
              'stent: merry christmas': 'b'
            }
          };

          (0, _handleAction2.default)(machine, 'run');
          return Promise.resolve().then(function () {
            expect(machine.state).to.deep.equal({ name: 'stent: merry christmas' });
          });
        });
        it('should handle errors properly through the generator chain', function () {
          var fetchFake = function fetchFake() {
            throw new Error('opa');
          };
          var api = /*#__PURE__*/regeneratorRuntime.mark(function api(name) {
            return regeneratorRuntime.wrap(function api$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    _context11.next = 2;
                    return (0, _.call)(fetchFake);

                  case 2:
                    return _context11.abrupt('return', _context11.sent);

                  case 3:
                  case 'end':
                    return _context11.stop();
                }
              }
            }, api, this);
          });
          var handler = /*#__PURE__*/regeneratorRuntime.mark(function handler() {
            return regeneratorRuntime.wrap(function handler$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    _context12.prev = 0;
                    _context12.next = 3;
                    return (0, _.call)(api, 'stent');

                  case 3:
                    _context12.next = 8;
                    break;

                  case 5:
                    _context12.prev = 5;
                    _context12.t0 = _context12['catch'](0);
                    return _context12.abrupt('return', _context12.t0.message);

                  case 8:
                  case 'end':
                    return _context12.stop();
                }
              }
            }, handler, this, [[0, 5]]);
          });
          var machine = {
            state: { name: 'idle', data: 42 },
            transitions: {
              idle: { run: handler },
              opa: { foo: 'bar' }
            }
          };

          (0, _handleAction2.default)(machine, 'run');
          return Promise.resolve().then(function () {
            expect(machine.state).to.deep.equal({ name: 'opa' });
          });
        });
      });
    });
  });

  describe('when we have middlewares registered', function () {
    it('should fire the middleware/s if an action is dispatched and after that', function (done) {
      _2.Machine.addMiddleware([{
        onActionDispatched: function onActionDispatched(actionName) {
          expect(actionName).to.equal('run');

          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          expect(args).to.deep.equal([{ answer: 42 }]);
          expect(machine.state).to.deep.equal({ name: 'idle' });
        }
      }, {
        onActionProcessed: function onActionProcessed(actionName) {
          expect(actionName).to.equal('run');

          for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          expect(args).to.deep.equal([{ answer: 42 }]);
          expect(machine.state).to.deep.equal({ name: 'running' });
          done();
        }
      }]);
      var machine = {
        state: { name: 'idle' },
        transitions: {
          idle: { run: 'running' },
          running: { stop: 'idle' }
        }
      };

      (0, _handleAction2.default)(machine, 'run', { answer: 42 });
    });
    it('should pass the machine as context', function () {
      var spy = sinon.spy();
      var machineA = {
        state: { name: 'idle' },
        transitions: {
          idle: { run: 'running' },
          running: { stop: 'idle' }
        }
      };
      var machineB = {
        state: { name: 'nothing' },
        transitions: {
          nothing: { run: 'foobar' },
          foobar: { stop: 'nothing' }
        }
      };
      _2.Machine.addMiddleware({
        onActionProcessed: function onActionProcessed(actionName) {
          spy(this.state.name);
        }
      });

      (0, _handleAction2.default)(machineA, 'run');
      (0, _handleAction2.default)(machineB, 'run');

      expect(spy).to.be.calledTwice;
      expect(spy.firstCall).to.be.calledWith('running');
      expect(spy.secondCall).to.be.calledWith('foobar');
    });
    it('should skip to the next middleware if there is no appropriate hook defined', function (done) {
      _2.Machine.addMiddleware([{
        onStateChanged: function onStateChanged() {}
      }, {
        onActionProcessed: function onActionProcessed(actionName) {
          expect(this.state).to.deep.equal({ name: 'running' });
          done();
        }
      }]);
      var machine = {
        state: { name: 'idle' },
        transitions: {
          idle: { run: 'running' },
          running: { stop: 'idle' }
        }
      };

      (0, _handleAction2.default)(machine, 'run', { answer: 42 });
    });
    it('should fire the middleware/s when the state is changed', function (done) {
      var spy = sinon.spy();
      _2.Machine.addMiddleware([{
        onStateWillChange: function onStateWillChange() {
          expect(this.state).to.deep.equal({ name: 'idle' });
          spy();
        },
        onStateChanged: function onStateChanged() {
          expect(this.state).to.deep.equal({ name: 'running' });
          spy();
        }
      }, {
        onStateChanged: function onStateChanged() {
          expect(spy).to.be.calledTwice;
          done();
        }
      }]);
      var machine = {
        state: { name: 'idle' },
        transitions: {
          idle: { run: 'running' },
          running: { stop: 'idle' }
        }
      };

      (0, _handleAction2.default)(machine, 'run', { answer: 42 });
    });
  });
});