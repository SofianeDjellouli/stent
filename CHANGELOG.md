## 6.0.0

Action handlers are pure functions now, i.e. they receive the machine as first argument and do not rely on `this` context.

Custom machine functions are no longer supported.

Example for a handler before 6.x:

```
'add todo': function (state, todo) {
  return {
    name: 'idle',
    todos: [...state.todos, todo]
  };
}
```

Example for a handler function in 6.x:

```
'add todo': function ({state}, todo) {
  return {
    name: 'idle',
    todos: [...state.todos, todo]
  };
}
```

Example for an arrow function as handler in 6.x:

```
'add todo': ({state}, todo) => ({
    name: 'idle',
    todos: [...state.todos, todo]
})
```


## 5.1.0

Every action now has a dedicated helper to see if it is available in the current machine transition set. For example:

```
{
  'idle': {
    run: 'running'
  },
  'running': {
    stop: 'idle'
  }
}

// we have
machine.isRunAllowed();
machine.isStopAllowed();
```

## 5.0.2

Fixing the case where the `call` function has no return statement.

## 5.0.1

The machine is no longer sent as a context of a function used in call helper. With this version also we are fixing the error handling of chained generators.

## 4.2.0

Stent is no longer sending uid to a middleware when initializing.

## 4.1.0

Support of custom methods added to the machine.

## 4.0.0

DevTools middleware moved to [Stent DevTools emitters](https://github.com/krasimir/stent-dev-tools-emitters) project.

## 3.6.6

Updates in the DevTools middleware.

## 3.6.5

Proper serialization of an error.

## 3.6.4

Exposing the `call` helper.

## 3.6.3

Fire generator resume middleware hook in the proper moment. Also covering the case where the generator is resumed with an error.

## 3.6.2

Calling onActionProcessed when the generator finishes.

## 3.6.1

Sending unique ID to the DevTools instance.

## 3.6.0

Adding `onGeneratorEnd` and `onGeneratorResumed` action types to the middleware.

## 3.5.3 - 3.5.8

Changes in DevTools extension.

## 3.5.2

Updating DevTools middleware onMachineConnect action.

## 3.5.1

Send the current machines' state in every DevTools message.

## 3.5.0

Improving DevTools middleware + test coverage

## 3.4.0

Adding `onMiddlewareRegister` middleware hook.

## 3.3.1

Exporting DevTools middleware.

## 3.3.0

Adding DevTools middleware.

## 3.2.3

Passing the name of the React component to the middleware hook.

## 3.2.2

Adding disconnect middleware call.

## 3.2.1

Fixing a critical bug introduced by 3.2.0 (do not use it).

## 3.2.0

Adding machine `destroy` method.

## 3.1.2

Tooling for the devtools.

## 3.1.1

Adding new middleware hooks. (`onMachineCreated`, `onMachineConnected`, `onMachineDisconnected`)

## 3.0.1

Adding devtools window global key access.

## 3.0.0

* Adding `machine.<method>.latest` alias so we cover the `takeLatest` saga method
* Changing the way of how the middlewares work. They now don't block the Stent's logic. No `next` method anymore. [Middlewares](./docs/middlewares.md)
* Documentation is restructured

## 2.0.0

Killing the `wait` generator helper. It is an anti-pattern. We shouldn't listen for actions like that. If there is such a need we better create a dedicated state for it.
Also some clean up.

## 1.1.5

Updating README + adding npm ignore file.

## 1.1.4

Making sure that the js context is kept while running generators.

## 1.1.3

Do not create a new error if a promise in a `call` gets rejected.

## 1.1.2

Just a README update.

## 1.1.1

Stop trying to print object in the Logger middleware.

## 1.1.0

Adding `onGeneratorStep` to the middleware's hook.

## 1.0.0

* Adding `Logger` middleware
* When adding a middleware the hook `onStateChange` is now called `onStateChanged`

## 0.7.3

Making sure that the mapping callback is fired only when the connected machine is updated.

## 0.7.2

README changes.

## 0.7.1

Fancy logo.

## 0.7.0

NOT throwing an error if the dispatched action is missing in the current state.

## 0.6.0

Short syntax for creating a machine.

## 0.5.0

Support of no mapping function in the `connect` helper + support of `mapSilent` for the React's version of connect.

## 0.4.0

Support of `wait(actionA, actionB)` on top of `wait([actionA, actionB])`

## Before 0.4.0

Wild Wild West ...