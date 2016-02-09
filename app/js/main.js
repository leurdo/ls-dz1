/*
** File input decoration and form validation
*/

(function() {
    var validation;
  
  publicMethod();
  init();
  attachEvents();
    
  function init() {
        $(function() {
            console.log('погнали');
        })
  };
  
  function attachEvents() {

    /* Loads input[file] text to fake field */
    $('#project-file').change( _LoadText );

    $('form').on('submit', function (e) {
        e.preventDefault();
        _processForm(this);
        });
    
    };

    $('.mes').on('click', function () {
        $(this).fadeOut(350);
    });

    function _LoadText () {
     
        var str = $(this).val();

        if (str.lastIndexOf('\\')) {
            var i = str.lastIndexOf('\\')+1;
        }

        else {
        var i = str.lastIndexOf('/')+1;
        }  

        var filename = str.slice(i);

        var e = $(this).siblings('.project-upload-field');

        e.html(filename);
    };
 
    function _processForm (form) {
        
        var inputs_group = $(form).find('.required');

        inputs_group.each(function() {

            if ( $(this).val().length == 0 ) {

                var 
                    this_el = $(this),
                    at_pos = $(this).attr('data-position'),
                    my_pos = 'right';
                    

                if (at_pos == 'right') {
                    my_pos = 'left';
                }

                this_el.addClass('not_ok');
                this_el.parent('.project-upload-input').addClass('not_ok');

                /* Calling qTip2 */
                this_el.qtip({ 
                    content: {
                        attr: 'data-tooltip' 
                    },
                    style: {
                        classes: 'qtip-red qtip-shadow qtip-rounded qtip-mine'
                    },
                    position: {
                        my: my_pos +' center',  // Position my...
                        at: at_pos +' center' // at the ...
                    },
                    show: {
                        ready: true,
                        event: false
                    },
                    hide: {
                        event: 'focus'
                    },
                    events: {
                        hide: function() {
                            this_el.removeClass('not_ok');
                            this_el.parent('.project-upload-input').removeClass('not_ok');
                        }
                    }
                })

            } 

        });

        if ( (!inputs_group.hasClass('not_ok')) && _validateRecaptcha(form) ) {
            console.log('Форма прошла валидацию');
            _ajaxForm(form);
        }
    };

    function _validateRecaptcha(form) {

            var recaptcha = true;
            
            if ($(form).find('.g-recaptcha').length) {
            recaptcha = grecaptcha.getResponse().length;
            }

            if (!recaptcha) {
                /*Show tooltip*/
                $('.g-recaptcha iframe').qtip ({
                    content: 'Поставьте галку',
                    position: {
                        my: 'left center',  // Position my...
                        at: 'right center' // at the ...
                    },
                    style: {
                        classes: 'qtip-red qtip-shadow qtip-rounded qtip-mine'
                    },
                    show: {
                        ready: true,
                        event: false
                    }

                })
            }

            return recaptcha;
    };

    function _ajaxForm (form) {

        var data = $(form).serialize();

        $('#project-file').fileupload({
            url: 'controller.php',
            dataType: 'json',
            
            done: function (e, data) {
                console.log('файл загружен');
                console.log(data);
            }
        });

        $.ajax({
             url: 'controller.php', // куда идет запрос
             type: 'post', // тип запроса
             dataType: 'json',
             data: data
        })
            .fail(function() {
                $('.mes-error').text('На сервере произошла ошибка');
                $('.mes-error').fadeIn(350);
            })
            .done(function(ans) {
                if (ans.status == 'OK') {
                    $('.mes-success').fadeIn(350);
                } else {
                    $('.mes-error').text(ans.text);
                    $('.mes-error').fadeIn(350);
                }

                $(form).find('input, textarea').on('focus', function () {
                    $(form).find('.mes').fadeOut(350);
                });

                _clearForm(form);

            });

        };

    function _clearForm(form) {

        $(form).find('input, textarea').val('');
        $(form).find('.project-upload-field').text('Загрузите изображение');

        if ($(form).find('.g-recaptcha').length) {
            grecaptcha.reset();
        }

    };
  
  function publicMethod() {
    validation = {

    };
  }
  
  return window.moduleName = validation;
})();


/*popup management*/

(function() {
    var popup;
  
  publicMethod();
  init();
  attachEvents();
    
  function init() {
        /* just code */
  };
  
  function attachEvents() {
    $('[data-popup-open]').on('click', pOpen);
    $('.popup').on('mouseup', pClose);
  };

  function pOpen (e) {
    e.preventDefault();

    var targeted_popup_class = jQuery(this).attr('data-popup-open');
    $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
  };

  function pClose (e) {
    e.preventDefault();
    e.stopPropagation();

    if ($(e.target).attr('class')=='popup' || $(e.target).attr('class')=='popup-close') {
        $('.popup').fadeOut(350);
        $('.qtip').hide();
        $('.form-input').removeClass('not_ok');
        $('.mes-error').text('');
        $('.mes').hide();
        }
  };
  
  function publicMethod() {
    popup = {
        
    };
  }
  
  return window.moduleName = popup;
})();


