(function() {
  $(function() {
    var processRegistration, validator;
    $('.contactus').click(function(e) {
      e.preventDefault();
      return $('.contactus').html('team@fantasylol.net');
    });
    processRegistration = function(data) {
      return console.log('success?');
    };
    return validator = $('#signupform').validate({
      debug: true,
      rules: {
        name: {
          required: true,
          minlength: 2,
          maxlength: 50,
          remote: {
            url: "checkusername",
            type: "post",
            data: {
              username: function() {
                return $('#name').val();
              }
            }
          }
        },
        password: {
          required: true,
          minlength: 3,
          maxlength: 50
        },
        email: {
          required: true,
          email: true,
          remote: {
            url: "checkemail",
            type: "post",
            data: {
              email: function() {
                return $('#email').val();
              }
            }
          }
        }
      },
      messages: {
        name: {
          required: "Summoner Name please! :)",
          minlength: $.format("No way your name is shorter than {0} characters!"),
          maxlength: $.format("No way your name is that longer than {0} characters!"),
          remote: $.format("Someone has taken {0}!")
        },
        password: {
          required: "Password please!",
          minlength: $.format("Passwords must be greater than {0} characters"),
          maxlength: $.format("Way too long! Keep it less than {0} characters")
        },
        email: {
          required: "Email please! No spam here :)",
          remote: $.format("{0} is already in use!")
        }
      },
      errorPlacement: function(error, element) {
        return error.insertAfter(element);
      },
      submitHandler: function(form) {
        var register;
        register = {};
        $.each($(form).children('.valid'), function(index, element) {
          return register[$(element).attr('name')] = $(element).val();
        });
        console.log(register);
        return $.ajax({
          data: register,
          url: '/register',
          cache: false,
          type: "POST",
          datatype: 'json',
          success: processRegistration,
          error: function(jqxr, status, error) {
            $('.registrationfail').html('Server error, try again?');
            return console.log(jqxr.responseText);
          }
        });
      }
    });
  });

}).call(this);

(function() {


}).call(this);
