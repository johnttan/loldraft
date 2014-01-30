
$ ->
    $('.contactus').click(
        (e)->
            e.preventDefault()
            $('.contactus').html('team@fantasylol.net')
        )

    $('#signupheader').click(
        (e)->
            e.preventDefault()
            $.ajax(
                data: {username: 'lol', password: 'lol'}
                url: '/login'
                cache: true
                type: "POST"
                datatype: 'html'
                success: processRegistration
                error: (jqxr, status, error)->
                    $('#signupheader').append('Server error, try again?')
                    console.log(jqxr.responseText)
            
            ))


    populateroster = (data) ->
        console.log(data)

    processRegistration = (data) ->
        animatelogout = ()->
            $('#signupheaderchild').fadeOut(50, ()->
                $(this).html("Logout")
                $(this).fadeIn(50)
                )
        fadeindraft = ()->
            $('.deck').html(data)
            $('.deck').fadeIn()
            $('#menu').animate({'margin-top':'39px'})
        $('.deck').fadeOut(200, fadeindraft)
        $('.pure-menu-horizontal').animate({
            padding: 0
            },
            {
                duration: 500
                easing: 'linear'
                complete: animatelogout
            }
            )



        $.ajax(
                url: '/roster'
                cache: false
                type: "GET"
                datatype: 'json'
                success: populateroster
                error: (jqxr, status, error)->
                    $('#signupheader').append('Server error, try again?')
                    console.log(jqxr.responseText)
            
            )
        


        


        

    validator = $('#signupform').validate({
        debug: true
        rules:{
            name: {
                required: true
                minlength: 2
                maxlength: 50
                remote: {
                    url: "checkusername"
                    type: "post"
                    data: {
                        username: ()->
                            return $('#name').val()
                            
                    }
                }

            },

            password: {
                required: true
                minlength: 3
                maxlength: 50
            },

            email: {
                required: true
                email: true
                remote: {
                    url: "checkemail"
                    type: "post"
                    data: {
                        email: ()->
                            return $('#email').val()
                    }
                }
            }

        },
        messages: {
            name: {
                required: "Summoner Name please! :)"
                minlength: $.format("No way your name is shorter than {0} characters!")
                maxlength: $.format("No way your name is that longer than {0} characters!")
                remote: $.format("Someone has taken {0}!")
            },
            password: {
                required: "Password please!"
                minlength: $.format("Passwords must be greater than {0} characters")
                maxlength: $.format("Way too long! Keep it less than {0} characters")
            },
            email: {
                required: "Email please! No spam here :)"
                remote: $.format("{0} is already in use!")
                
            }
        },
        errorPlacement: (error, element)->
                    error.insertAfter(element)
        ,
        submitHandler: (form)->
            register = {}
            $.each($(form).children('.valid'), (index, element)->
                register[$(element).attr('name')] = $(element).val()
                )
            console.log(register)

            $.ajax({
                data: register
                url: '/register'
                cache: false
                type: "POST"
                datatype: 'json'
                success: processRegistration
                error: (jqxr, status, error)->
                    $('.registrationfail').html('Server error, try again?')
                    console.log(jqxr.responseText)



            })

        })

    