// enable ES6 in subsequent files
require('babel-core/register');

// handles live node reloads
if (process.env.NODE_ENV === 'development') {
  if (!require('piping')({
    hook: true,
    ignore: /(\/\.|~$|\.json$)/i
  })) {
    return;
  }
}

// actually start app
require('../server')
