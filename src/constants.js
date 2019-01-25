// errors
export const ERROR_MISSING_MACHINE = name => `There's no machine with name ${ name }`;
export const ERROR_MISSING_STATE = 'Configuration error: missing initial "state"';
export const ERROR_MISSING_TRANSITIONS = 'Configuration error: missing "transitions"';
export const ERROR_WRONG_STATE_FORMAT = state => {
  const serialized = typeof state === 'object' ? JSON.stringify(state, null, 2) : state;

  return `The state should be an object and it should always have at least "name" property. You passed ${ serialized }`;
}
export const ERROR_UNCOVERED_STATE = state => `You just transitioned the machine to a state (${ state }) which is not defined or it has no actions. This means that the machine is stuck.`;
export const ERROR_NOT_SUPPORTED_HANDLER_TYPE = 'Wrong handler type passed. Please read the docs https://github.com/krasimir/stent';
export const ERROR_RESERVED_WORD_USED_AS_ACTION = word => `Sorry, you can't use ${ word } as a name for an action. It is reserved.`;
export const ERROR_GENERATOR_FUNC_CALL_FAILED = type => `The argument passed to \`call\` is falsy (${type})`;

// middlewares
export const MIDDLEWARE_PROCESS_ACTION = 'onActionDispatched';
export const MIDDLEWARE_ACTION_PROCESSED = 'onActionProcessed';
export const MIDDLEWARE_STATE_WILL_CHANGE = 'onStateWillChange';
export const MIDDLEWARE_PROCESS_STATE_CHANGE = 'onStateChanged';
export const MIDDLEWARE_GENERATOR_STEP = 'onGeneratorStep';
export const MIDDLEWARE_GENERATOR_END = 'onGeneratorEnd';
export const MIDDLEWARE_GENERATOR_RESUMED = 'onGeneratorResumed';
export const MIDDLEWARE_MACHINE_CREATED = 'onMachineCreated';
export const MIDDLEWARE_MACHINE_CONNECTED = 'onMachineConnected';
export const MIDDLEWARE_MACHINE_DISCONNECTED = 'onMachineDisconnected';
export const MIDDLEWARE_REGISTERED = 'onMiddlewareRegister';

// misc
export const DEVTOOLS_KEY = '__hello__stent__';