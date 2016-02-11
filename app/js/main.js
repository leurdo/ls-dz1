/**
 * Forms processing
 */

(function() {

 var filesList = [];
  
  publicMethod();
  init();
  attachEvents();
    
  function init() {
     filesList = _initFileUpload();
  };
  
  function attachEvents() {

    // Loads input[file] text to fake field 
    $('#project-file').change( _loadText );

    // Inits form processing on submit
    $('form').on('submit', function (e) {
        e.preventDefault();
        _processForm(this);
        });
    };

    // Hides success and error messages
    $('.mes').on('click', function () {
        $(this).fadeOut(350);
    });

    function $showTooltip (object, content, atPos) {

        var myPos = 'right';

        if (atPos == 'right') {
            myPos = 'left';
            }

        object.qtip ({
                    content: content,
                    position: {
                        my: myPos +' center',  // Position my...
                        at: atPos +' center' // at the ...
                    },
                    style: {
                        classes: 'qtip-red qtip-shadow qtip-rounded qtip-mine'
                    },
                    show: {
                        ready: true,
                        event: false
                    },
                    hide: {
                        event: 'focus'
                    },
                })
    }

    function _initFileUpload () {

        $('#project-file').fileupload({
            url: 'UploadHandler.php',
            dataType: 'json',
            replaceFileInput: false,
            maxNumberOfFiles: 1,
            add: function(e, data) {
                if (!~data.files[0].type.indexOf('image')) {
                    $showTooltip($(this), 'Файл не картинка', 'left');
                } else 
                if (data.files[0].size > 5000000) {
                    $showTooltip($(this), 'Файл слишком большой', 'left');
                } else {
                    data.submit();
                }
            },
            done: function (e, data) {
                    var fileName = data.files[0].name;
                    $('#project-file-name').val(fileName);
                  }
        })
        

    };

    function _loadText () {
     
        var fileName = $(this).val(),
            namePos,
            fileNameCut;

        if (fileName.lastIndexOf('\\')) {
            namePos = fileName.lastIndexOf('\\')+1;
        } else {
            namePos = fileName.lastIndexOf('/')+1;
        }  

        fileNameCut = fileName.slice(namePos);

        $(this).siblings('.project-upload-field').html(fileNameCut);
    };
 
    function _processForm (form) {
        
        var inputsGroup = $(form).find('.required');

        inputsGroup.each(function() {

            if ( $(this).val() === '' ) {

                var 
                    thisElement = $(this),
                    atPos = $(this).attr('data-position'),
                    myPos = 'right';
                    

                if (atPos == 'right') {
                    myPos = 'left';
                }

                thisElement.addClass('not-ok');
                thisElement.parent('.project-upload-input').addClass('not-ok');

                // Calling qTip2 
                thisElement.qtip({ 
                    content: {
                        attr: 'data-tooltip' 
                    },
                    style: {
                        classes: 'qtip-red qtip-shadow qtip-rounded'
                    },
                    position: {
                        my: myPos +' center',  // Position my...
                        at: atPos +' center' // at the ...
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
                            thisElement.removeClass('not-ok');
                            thisElement.parent('.project-upload-input').removeClass('not-ok');
                        }
                    }
                })

            } 

        });

        if ( (!inputsGroup.hasClass('not-ok')) && _validateRecaptcha(form) ) {
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
                //Show tooltip
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

        var data = $(form).serializeArray();
    
        $.ajax({
             url: 'controller.php', // куда идет запрос
             type: 'post', // тип запроса
             dataType: 'json',
             data: data   
        })
            .fail(function(ans) {
                $('.mes-error').text('На сервере произошла ошибка');
                $('.mes-error').fadeIn(350);
            })
            .success(function(ans) {
                $('.mes-success').fadeIn(350);
                console.log(ans.object);

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
  
  function publicMethod() {};
  
})();


/**
 * Popup management
 */

(function() {
    var popup;
  
  publicMethod();
  init();
  attachEvents();
    
  function init() {};
  
  function attachEvents() {
    $('[data-popup-open]').on('click', onOpen);
    $('.popup').on('mouseup', onClose);
  };

  function onOpen (e) {
    e.preventDefault();

    var targeted_popup_class = $(this).attr('data-popup-open');
    $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
  };

  function onClose (e) {
    e.preventDefault();

    var $target = $(e.target);

    if ($target.attr('class')=='popup' || $target.attr('class')=='popup-close') {
        $('.popup').fadeOut(350);
        $('.qtip').hide();
        $('.form-input').removeClass('not-ok');
        $('.mes-error').text('');
        $('.mes').hide();
        }
  };
  
  function publicMethod() {};
  
})();


