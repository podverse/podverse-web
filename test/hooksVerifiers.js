function verifyHooks (service, lifecycleType, method, hooks) {

  let typeCheck,
    hookName = `'${lifecycleType} ${method}'`;

  if(!Array.isArray(hooks)) {
    chai.assert(false, 'You need to provide an array of hooks');
  }

  if(!service) {
    chai.assert(false, 'Could not verify hooks on falsy service');
  }

  typeCheck = typeof(service[lifecycleType]);
  if(typeCheck !== 'object') {
    chai.assert(false, `expected 'service.before' to be an object, got ${typeCheck}`);
  }

  typeCheck = typeof(service[lifecycleType][method]);
  if(!Array.isArray(service[lifecycleType][method])) {
    chai.assert(false, `expected the '${lifecycleType} ${method}' hooks to be an array instead got ${typeCheck}`);
  }



  hooks.forEach((item, idx) => {

    let expected = service[lifecycleType][method][idx];

    //expect(expected).to.equal(item, `Unexpected hook at ${hookName} #${idx}`);
  });


  let expectedHookNames = hooks.map(hook => hook.name || hook),
    actualHookNames = service[lifecycleType][method].map(hook => hook.name || hook);

  expect(service[lifecycleType][method])
    .to.deep.equal(hooks, `Unexpected '${lifecycleType} ${method}' hooks\n` +
    `\tExpected: [${expectedHookNames}] \n` +
    `\tActual: [${actualHookNames}] \n`);
}



['Get', 'Create', 'Update', 'Delete', 'Patch'].forEach(function (svcMethod) {

  ['Before', 'After'].forEach(lifecycle => {

    let name  = `verify${lifecycle}${svcMethod}Hooks`;
    global[name] = function (service, hooks) {
      verifyHooks(service, lifecycle.toLowerCase(), svcMethod.toLowerCase(), hooks);
    };

  });

});
