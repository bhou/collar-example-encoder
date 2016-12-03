(function($) {
  const ns = collar.ns('collar.example.encoder.ui.login', {
    arch: 'ui.login',
    author: 'Bo HOU'
  });
  
const loginSensor =
  ns.sensor('ui sensor', function(options) {
    const self = this;
    $('#login').click(function(e) {
      e.preventDefault();
      self.send({
        event: 'login',
        username: $('#email').val(),
        password: $('#password').val(),
        remember: $('#remember-1').val() ? true : false
      });
    });

    var lastEmailChangeTime = new Date().getTime();
    var lastPasswordChangeTime = new Date().getTime();
    $('#email').on('input', function(e) {
      var now = new Date().getTime();
      if (now - lastEmailChangeTime < 300) return;
      lastEmailChangeTime = now;
      self.send({
        event: 'email changed',
        email: $('#email').val()
      })
    });
    $('#password').on('input', function(e) {
      var now = new Date().getTime();
      if (now - lastPasswordChangeTime < 300) return;
      lastPasswordChangeTime = now;
      self.send({
        event: 'password changed',
        email: $('#password').val()
      })
    })
  });

const loginPipeline = loginSensor
  .when('login', function(s) {
    return s.get('event') === 'login';
  })
  .actuator('send request', function(s, done) {
    $.post( '/webapi/login', s.payload, function(data) {
      done(null, data);
    })
    .fail(function(e) {
      done(new Error(e.responseJSON.msg))
    });
  })
  .errors(function(s, rethrow) {
    console.error(s.error);
    rethrow(s.new({
      event: 'error',
      msg: s.error.message
    }))
  });

loginPipeline
  .when('error', function(s) {
    return s.get('event') === 'error';
  })
  .do('show error message', function(s) {
    $('#error-msg > p')
      .text(s.get('msg'))
      .show();
  });

loginPipeline
  .when('login ok', function(s) {
    return s.get('event') !== 'error';
  })
  .do('redirect to home page', function(s) {
    window.location.href = "/";
  });


loginSensor
  .when('input (email or password) changed', function(s) {
    return s.get('event') === 'email changed' || s.get('event') === 'password changed';
  })
  .do('hide error message', function(s) {
    $('#error-msg > p')
      .text('')
      .hide();
  });

}(jQuery));
