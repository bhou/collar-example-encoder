(function($) {
  const ns = collar.ns('collar.example.encoder.ui.register', {
    arch: 'ui.register',
    author: 'Bo HOU'
  });
  
  const registerSensor = ns
    .sensor('register sensor', function() {
      var self = this;
      $('#register').click(function(e) {
        e.preventDefault();
        self.send({
          event: 'register',
          username: $('#email').val(),
          password: $('#password').val()
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
      });

    });

  const registerPipeline = registerSensor
    .when('register', function(s) {
      return s.get('event') === 'register';
    })
    .actuator('send "register" request', function(s, done) {
      $.post( '/webapi/register', s.payload, function(data) {
        done(null, data);
      })
      .fail(function(e) {
        done(new Error(e.responseJSON.msg))
      });
    })
    .errors(function(s, rethrow) {
      rethrow(s.new({
        event: 'error',
        msg: s.error.message
      }));
    });
  
  registerPipeline
    .when('error', function(s) {
      return s.get('event') === 'error';
    })
    .do('show error message', function(s) {
      $('#error-msg > p')
      .text(s.get('msg'))
      .show();
    });
  
  registerPipeline
    .when('register done', function(s) {
      return s.getResult().msg === 'registered';
    })
    .do('redirect to home page', function(s) {
      window.location.href = "/";
    });

  registerSensor
    .when('input (email or password) changed', function(s) {
      return s.get('event') === 'email changed' || s.get('event') === 'password changed';
    })
    .do('hide error message', function(s) {
      $('#error-msg > p')
        .text('')
        .hide();
    });

  
}(jQuery));
