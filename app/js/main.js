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

    function _initFileUpload () {

        $('#project-file').fileupload({
            autoUpload: false,
            url: 'controller.php',
            dataType: 'json',
            sequentialUploads: true,
            replaceFileInput: false,
            maxNumberOfFiles: 1
        })
        .bind('fileuploadadd', function (e, data) {
            filesList = data.files;
            return filesList;
        });

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
            
            if ($(form).find('#project-file').length) {
                _fileuploadForm(form);
            } else {
                _ajaxForm(form);
            }
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

    function _fileuploadForm (form) {

        $('#project-file').fileupload('send', {files: filesList})
            .success(function (result, textStatus, jqXHR) {
                console.log('success');
                _ajaxForm (form);
            })
            .error(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $('.mes-error').text(errorThrown);
                $('.mes-error').fadeIn(350);
            });
            

    };

    function _ajaxForm (form) {

        var data = $(form).serialize();

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
                console.log(ans.files);

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


