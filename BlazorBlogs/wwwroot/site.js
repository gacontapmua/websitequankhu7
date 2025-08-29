function promptLogin() {
    $.confirm({
        boxWidth: '280px',
        useBootstrap: false,
        draggable: true,
        title: '',
        content: '<div style="padding:10px;">Bạn chưa đăng nhập. Click OK để đăng nhập bằng Google (không cần đăng ký thành viên).<br><br>Sau khi đăng nhập thành công, hãy thử thực hiện lại thao tác này.</div>',
        type: 'blue',
        closeIcon: true,
        buttons: {
            confirm: {
                btnClass: 'btn-blue',
                text: 'OK',
                action: function () {
                    showInPageLoginForm();
                },
            },
            cancel: {
                text: 'Cancel',
                action: function () {

                },
            }
        }
    });
}

function showInPageLoginForm() {

    $('#inPageLoginFormOuterContainerDiv').show();
    document.body.style.overflowY = 'scroll';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    $('.post_item_menu_container').slideUp(200);
}

function closeInPageLoginForm() {
    $('#inPageLoginFormOuterContainerDiv').hide();
    document.body.style.overflowY = 'auto';
    document.body.style.position = 'static';
}

function doLogout() {
    $.confirm({
        boxWidth: '280px',
        useBootstrap: false,
        draggable: true,
        type: 'red',
        title: '',
        content: '<div style="text-align:center;padding:10px" class="text_18 text_cabin">Thoát khỏi hệ thống?</div>',
        buttons: {
            confirm: {
                btnClass: 'btn-red',
                text: 'OK',
                action: function () {
                    //Set autoReconnect to false
                    autoReconnect = false;

                    $.connection.hub.disconnected(function () {
                        console.log('Hub connection drop, start ajax calling...');
                    });

                    $.connection.hub.stop();

                    doAjaxLogout();
                }
            },
            cancel: {
                text: 'Cancel',
                action: function () {

                }
            }
        }
    });
}

function doAjaxLogout() {
    var d = $.dialog({
        boxWidth: '280px',
        useBootstrap: false,
        closeIcon: false,
        title: '',
        content: '<div style="padding:10px;text-align:center">Đang xử lý...</div>',
        type: 'green',
    });

    $.post("?callback=true", {
        txtCallbackType: 'doLogout',
    })
        .done(function (msg) {
            d.close();
            if (msg == 'OK') {
                //reloadPageAjax();
                self.location.href = '/';
            }

            //autoReconnect = true;
            //$.connection.hub.start().done(function () {
            //    console.log('hub reconnected!');
            //});
        })
        .fail(function (xhr, status, error) {
            d.close();
            doAlertServerError(error, '<div style="width:100%;overflow-y:hidden">' + xhr.responseText + '</div>');

            autoReconnect = true;
            $.connection.hub.start().done(function () {
                console.log('hub reconnected!');
            });
        })
}

function getDialogHeight() {
    var h = $(window).height();
    var dialogH = '';

    if (h <= 320) {
        dialogH = '100%';
    }
    else if (h <= 568) {
        dialogH = '80%'
    }
    else if (h <= 800) {
        dialogH = '70%'
    }
    else if (h <= 1024) {
        dialogH = '50%'
    }

    else if (h <= 1280) {
        dialogH = '40%'
    }
    else {
        dialogH = '30%'
    }
    return dialogH;
}

function getDialogWidth() {
    var w = $(window).width();
    var dialogW = '';

    if (w <= 320) {
        dialogW = '100%';
    }
    else if (w <= 568) {
        dialogW = '90%'
    }
    else if (w <= 800) {
        dialogW = '80%'
    }
    else if (w <= 1024) {
        dialogW = '70%'
    }

    else if (w <= 1280) {
        dialogW = '60%'
    }
    else {
        dialogW = '50%'
    }
    return dialogW;
}

function doAlertInform(title, content) {
    $.alert({
        boxWidth: getDialogWidth(),
        useBootstrap: false,
        draggable: true,
        title: title,
        content: content,
        type: 'green',
        buttons: {
            cancel: {
                text: 'Close',
            }
        }
    });
}

function doAlertServerError(title, content) {
    $.alert({
        useBootstrap: false,
        draggable: true,
        title: title,
        content: content,
        type: 'red'
    });
}

function doAlertDocHasMoved() {
    $.dialog({
        boxWidth: '280px',
        useBootstrap: false,
        draggable: true,
        title: 'Lỗi',
        content: 'Bạn không thể thực hiện được chức năng này vì văn bản này đã được chuyển cho người khác để xử lý!',
        type: 'red',
        closeIcon: true,
    });

}

function doAlertDataExpired() {
    $.dialog({
        boxWidth: '280px',
        useBootstrap: false,
        draggable: true,
        title: 'Lỗi',
        content: 'Bạn không thể thực hiện được chức năng này vì dữ liệu đã bị khóa!',
        type: 'red',
        closeIcon: true,
    });
}

function doAlertNoRight() {
    $.dialog({
        boxWidth: '280px',
        useBootstrap: false,
        draggable: true,
        title: 'Lỗi',
        content: 'Nội dung này không tồn tại hoặc bạn không có đủ quyền để thực hiện chức năng này!',
        type: 'red',
        closeIcon: true,
    });
}

function doAlertNoPublicPost() {
    $.dialog({
        boxWidth: '280px',
        useBootstrap: false,
        draggable: true,
        title: 'Lỗi',
        content: 'Bạn không thể đăng bài vào chuyên mục này!',
        type: 'red',
        closeIcon: true,
    });
}

function doAlertError(title, content, focusObjectId) {
    if ($('#' + focusObjectId).length > 0) {
        $('#' + focusObjectId)[0].scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });

        flashingById(focusObjectId);
    }

    $.dialog({
        boxWidth: '280px',
        useBootstrap: false,
        draggable: true,
        title: title,
        content: content,
        type: 'red',
        closeIcon: true,
        onDestroy: function () {
            if (focusObjectId != null && focusObjectId != undefined) {
                //    flashingById(focusObjectId);
            }
        },
    });
}

function flashingById(itemId) {

    if (enableFlashingById) {
        if ($('#' + itemId).length > 0) {
            for (i = 0; i < 3; i++) {
                if (itemId.indexOf('lst') > -1) {
                    $('#' + itemId).parent().fadeOut(100).fadeIn(100);
                }
                else {
                    $('#' + itemId).fadeOut(100).fadeIn(100);
                }

            }

            if (itemId.indexOf('txt') > -1 && !$('#' + itemId).prop('disabled')) {
                $('#' + itemId).focus();
            }

        }
    }
}

function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function flashingByObject(obj) {
    if (!isElementInViewport(obj)) {
        $('html, body').animate({ scrollTop: $(obj).offset().top }, 500);
    }

    for (i = 0; i < 5; i++) {
        $(obj).fadeOut(100).fadeIn(100)
    }

    //$(obj).focus();
}

function showSaveOK(reloadMode) {
    var waitDailog = $.dialog({
        boxWidth: '280px',
        useBootstrap: false,
        draggable: true,
        title: null,
        content: '<div style="text-align:center;padding:10px" class="text_cabin">Đã thực hiện</div>',
        type: 'green',
        closeIcon: true,
    });

    setTimeout(function () {
        waitDailog.close();

        switch (reloadMode) {
            case 0:
                self.location.reload();

                break;

            case 1:
                self.parent.location.reload();

                break;

            default:
                break;
        }
    }, 500);
}

let isToastVisible = false;

function showToastMessage(msg, toastClass) {

    if (isToastVisible) return; // Prevent further execution if the toast is already visible

    isToastVisible = true;

    $('#toastDiv').removeClass().addClass(toastClass).html(msg).show();

    // Trigger the shake animation
    $('#toastDiv').addClass('shake');

    setTimeout(function () {
        $('#toastDiv').fadeOut(200, function () {
            isToastVisible = false; // Allow future executions after fading out
            $('#toastDiv').removeClass('shake');

        });
    }, 1200); //


    //// Remove the shake class after animation completes
    //setTimeout(function () {
    //    $('#toastDiv').removeClass('shake');
    //}, 500);
}


function numberIsValid(c) {
    var regSpecialChars = /[^0-9\,\.]/g;
    var foundChars = c.match(regSpecialChars);

    //alert(foundChars);

    if (foundChars != null) {
        return false;
    } else {
        return true;
    }
}
var reloadParent = false;

var showWaitDailog = false;

function reloadPageAjax(mainContainerId, url, callbackFunctionName) {
    var d = null;

    if (showWaitDailog) {
        d = $.dialog({
            boxWidth: '280px',
            useBootstrap: false,
            draggable: true,
            title: '',
            content: '<div style="text-align:center">Xin chờ trong giây lát...</div>',
            type: 'green',
            closeIcon: true,
        });
    }

    var targetUrl = url == undefined ? self.location.href : url;

    $.ajax({
        url: targetUrl, // Replace with the actual URL of the page you want to load
        method: 'GET',
        dataType: 'html',
        success: function (html) {
            var newContainerdiv = null;

            if (mainContainerId == undefined || mainContainerId == null) {
                newContainerdiv = $(html).find('#headerDiv');
                $('#headerDiv').html($(newContainerdiv).html());

                newContainerdiv = $(html).find('#mainContainer');

                $('#mainContainer').html($(newContainerdiv).html());
            }
            else {
                var textArray = mainContainerId.split(',');

                for (i = 0; i < textArray.length; i++) {
                    var key = textArray[i];

                    newContainerdiv = $(html).find('#' + key);

                    $('#' + key).html($(newContainerdiv).html());

                    //if (key == 'statusDiv') {
                    //    console.log(key);
                    //    console.log($('#' + key).html());

                    //}

                }
            }

            setTimeout(function () {
                initFormGeneral();

                if ($('#stickPostContainerOuterDiv').length > 0) {
                    initStickyPostForm();
                }
            }, 200);

            if (d != null && d != undefined) {
                d.close();
            }

            d = null;

            // Execute the function if the function name is passed
            if (callbackFunctionName && typeof window[callbackFunctionName] === 'function') {
                window[callbackFunctionName]();
            }

        },
        error: function (xhr, status, error) {
            d.close();
            // Handle errors
            console.error('Error loading page:', status, error);
        }
    });
}

function autoHeightTextArea(textarea) {
    // Set the textarea's height to its scrollHeight
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function getParentPageFileName() {
    var parentUrl = parent.location.href.toLowerCase();
    var pageFileName = parentUrl.substring(parentUrl.lastIndexOf('/') + 1).split('?')[0];
    return pageFileName;
}

function getFolderName(pageFileName) {
    var folderName = '';

    for (i = 0; i < pageJsonArray.length; i++) {

        var dataRow = pageJsonArray[i];

        if (dataRow.PageFileName == pageFileName) {
            folderName = dataRow.FolderName;
            break;
        }
    }

    return folderName;
}

function showHelp(sender, controlId) {
    pageUrl = '/index.aspx'.replace(/.aspx/gi, '.html');

    var tempDiv = $('<div></div>'); // Create a temporary <div> element

    $.get(pageUrl, function (data) {

        var html2 = data.replace(/\<\%=PathPrefix\%\>/gi, '/');

        tempDiv.html(html2); // Insert the HTML content into the temporary <div>

        var helpText = tempDiv.find('#' + controlId).html(); // Find the element with the specified ID

        tempDiv.remove();

        $('#inlinePopupContentDiv').html(helpText);

        var anchorOffset = $(sender).offset();
        var popup = $('#inlinePopupContainerDiv');

        var topOffset = 0;
        if (controlId.indexOf('txt') > -1 || controlId.indexOf('lst') > -1) {
            topOffset = 34;
        }
        else {

        }
        popup.css({
            top: anchorOffset.top + topOffset + 'px',
            left: anchorOffset.left + 28 + 'px',
            display: 'block'
        });

        $(document).on('click', function (e) {
            if (!$(e.target).closest('.anchor').length && !$(e.target).closest('#inlinePopupContainerDiv').length) {
                popup.css('display', 'none');
                $(document).off('click');
            }
        });

        flashingById(controlId);

    }, 'html');
}

function copyTxt(txtId) {
    var inputValue = $("#" + txtId).val();

    // Copy the value to the clipboard
    var tempInput = $("<textarea>");
    $("body").append(tempInput);
    tempInput.val(inputValue).select();
    document.execCommand("copy");
    tempInput.remove();

    flashingById(txtId);

}

function validateForm(containerDivId) {

    var validated = true;

    $(":button").prop('disabled', true);

    $('input[type=text], textarea').each(function () {
        $(this).val($.trim($(this).val()));
    });

    var allControls = $('#' + containerDivId).find('input[type="text"], textarea, select');

    allControls.each(function (i, e) {
        var id = $(e).attr('id');
        var prefix = id.substring(0, 3);
        switch (prefix) {
            case 'txt':
                var t = $(e).prop('type');

                if (t != 'hidden') {
                    if ($(e).hasClass('not_null') && $(e).val() == '') {
                        validated = false;
                        doAlertError('Lỗi', 'Ô này không được để trống!', id.replace('#', ''));
                        return false;
                    }
                    else if (($(e).hasClass('int') || $(e).hasClass('float')) && $(e).val() != '' && !numberIsValid($(e).val())) {
                        validated = false;
                        doAlertError('Lỗi', 'Số không hợp lệ!', id.replace('#', ''));
                        return false;
                    }
                    else if ($(e).hasClass('email') && $(e).val() != '' && !isValidEmail($(e).val())) {
                        validated = false;
                        doAlertError('Lỗi', 'Email không hợp lệ!', id.replace('#', ''));
                        return false;
                    }
                    else if ($(e).hasClass('datetime') && $(e).val() != '' && !isValidDateTime($(e).val())) {
                        validated = false;
                        doAlertError('Lỗi', 'Ngày giờ không hợp lệ!', id.replace('#', ''));
                        return false;
                    }
                }

                break;

            case 'lst':

                if ($(e).hasClass('not_null') && ($(e).val() == null || $(e).val() == '' || $(e).val() == '-1')) {
                    validated = false;
                    doAlertError('Lỗi', 'Bạn chọn 1 giá trị cho mục này', id.replace('#', ''));
                    return false;
                }

                break;

            default:
                break;
        }
    });

    $(":button").prop('disabled', false);

    return validated;
}

function isValidEmail(email) {
    // Regular expression for email validation
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if the email matches the pattern
    return emailPattern.test(email);
}

function checkMe(a) {
    var chk = $(a).find('input');

    if ($(chk).is(':disabled')) {
        chk.attr("checked", false);
        $(a).parent().attr('class', 'bg_gray');
    }
    else {
        chk.attr("checked", !chk.attr("checked"));

        if (chk.attr("checked")) {
            if ($(a).parent().attr('class') != 'cell_disabled') {
                $(a).parent().attr('class', 'cell_enabled');
            }
        }
        else {
            if ($(a).parent().attr('class') != 'cell_disabled') {
                $(a).parent().attr('class', 'border_gray');
            }

        }
    }
}

/*VIDEO PREVIEW*/
var videoPreviewHnadler = null;
var currentHiddenDiv = null;

function playPreview(a) {
    var hidden_div = $(a).find('.hidden_div');
    hidden_div.hide();
    currentHiddenDiv = hidden_div;

    var img = $(a).find('.img_thumb')[0];

    if ($(img).attr('image-urls') != undefined) {
        var imageUrlArray = $(img).attr('image-urls').split('|');

        var imgIndex = 1;

        videoPreviewHnadler = setInterval(() => {
            var imgUrl = imageUrlArray[imgIndex++];
            if (imgIndex >= imageUrlArray.length) {
                imgIndex = 0;
            }

            $(img).attr('src', imgUrl);

        }, 500);
    }

}

function stopPreview() {
    if (videoPreviewHnadler != null && videoPreviewHnadler != undefined) {
        clearInterval(videoPreviewHnadler);
    }

    if (currentHiddenDiv != null) {
        currentHiddenDiv.show();
    }
}

/*END VIDEO PREVIEW*/

function gotoUrl(url) {

    self.location.href = url;

}

function isValidDateTime(dateTimeString) {
    // Check format using regex
    const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
    const match = dateTimeString.match(regex);
    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JS months = 0-11
    const year = parseInt(match[3], 10);
    const hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);
    const second = parseInt(match[6], 10);

    // Basic range check
    if (
        hour < 0 || hour > 23 ||
        minute < 0 || minute > 59 ||
        second < 0 || second > 59
    ) {
        return false;
    }

    const date = new Date(year, month, day, hour, minute, second);

    // Check if date parts match input (to catch invalid dates like 31/02/2025)
    return date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day &&
        date.getHours() === hour &&
        date.getMinutes() === minute &&
        date.getSeconds() === second;
}

function toVNfullDateTime(dateTime) {
    const date = new Date(dateTime).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const time = new Date(dateTime).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return `${date} ${time}`;

    //const options = {
    //    day: '2-digit',
    //    month: '2-digit',
    //    year: 'numeric',
    //    hour: '2-digit',
    //    minute: '2-digit',
    //    second: '2-digit'
    //};

    //return new Date(dateTime).toLocaleString('vi-VN', options);
}

function toLocaleNumber(val) {
    return val.toLocaleString('vi-VN');
}


function moveTop() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}

function scrollTo(id) {
    $('#' + id).animate({ scrollTop: 0 }, 'slow');
}

function urlEncode(input) {
    input = input.toLowerCase();
    //input = toUnsignedText(input);
    input = input.replace(/&/gi, "%26");
    input = input.replace(/#/gi, "%23");
    input = input.replace(/\?/gi, "%3F");
    input = input.replace(/'/gi, "%27");
    input = input.replace(/\"/gi, "%22");
    input = input.replace(/\//gi, "%2F");
    input = input.replace(/:/gi, "%3A");
    input = input.replace(/;/gi, "%3B");
    input = input.replace(/%/gi, "%25");
    input = input.replace(/>/gi, "%3E");
    input = input.replace(/</gi, "%3C");

    input = input.replace(/ /gi, "-");
    return input;
}

function formatVND(pricePerM2) {
    var suffix = '';
    if (pricePerM2 >= 1000000000) {
        pricePerM2 = pricePerM2 / 1000000000;
        suffix = ' Tỷ/m<sup>2</sup>';
    }
    else if (pricePerM2 >= 1000000) {
        pricePerM2 = pricePerM2 / 1000000;
        suffix = ' Triệu/m<sup>2</sup>';
    }
    else if (pricePerM2 >= 1000) {
        pricePerM2 = pricePerM2 / 1000;
        suffix = ' Ngàn/m<sup>2</sup>';
    }

    var vndStr = $.number(pricePerM2, 1, ',', '.').replace(',0', '') + suffix;

    return vndStr;
}

function closeWindow() {
    var current = $.featherlight.current();
    current.close();
}

function resizeIFrameToFitContent(iFrame) {
    var iFrame = document.getElementById('mainIframe');
    var h = iFrame.contentWindow.document.body.scrollHeight + 16;
    $('#mainIframe').css('height', h);
    console.log('iFrame.contentWindow.document.body.scrollHeight: ' + h)
}

function showMainIframeWindow(url, paddingPixel, iframeCssClass) {
    document.body.style.overflowY = 'hidden';

    $('#mainIframe').attr('src', url);

    if (paddingPixel != undefined) {
        $("#mainIframeContainer").css('padding', paddingPixel + 'px');
    }
    else {
        $("#mainIframeContainer").css('padding', '20px');
    }

    if (iframeCssClass == undefined) {
        iframeCssClass = 'main_iframe_default';
    }

    $('#mainIframe').attr('class', iframeCssClass);

    $("#mainIframeContainer").show("slow");
}

function closeMainIframeWindow() {
    document.body.style.overflowY = 'auto';
    $("#mainIframeContainer").hide("slow");
    $('#mainIframe').attr('src', '');

    if (reloadParent) {
        self.location.reload();
    }
}



//function showHideMobileMenu() {
//    $('#headerMainMenuContainerDiv').toggle('slow');
//}

$(function () {
    initFormGeneral();
});

function initFormGeneral() {
    try {
        $(".calendar_txt").datepicker({
            minDate: 0,
            //minDate: new Date(1970, 1, 1),
            dateFormat: 'dd/mm/yy',
            regional: 'vi',
        });

        $('.calendar_txt').attr('placeholder', 'dd/MM/yyyy');

        $(".calendar_txt").on("focus", function () {
            $(this).blur();
        });

        $('.select2').select2({
            /*minimumResultsForSearch: -1,*/
        });

        // Target the DropDownList with the "disable-search" class
        $('.no_search_box').select2({
            minimumResultsForSearch: -1 // Disable the search box
        });
    }
    catch (e) {

    }

    document.onsubmit = function () {
        return false;
    };

    window.onclick = function (event) {
        if (!event.target.matches('.noClickCount')) {
            while (document.getElementsByClassName("search_dropdown_container_show").length > 0) {
                var openDropdown = document.getElementsByClassName("search_dropdown_container_show")[0];
                if (openDropdown.classList.contains('search_dropdown_container_show')) {
                    openDropdown.classList.remove('search_dropdown_container_show');
                }
            }

            //                $('#searchBar').fadeOut(500);
        }
    };

    bindMenuEvent();
}

function bindMenuEvent() {
    $('.search_dropdown_item').mouseover(function () {
        hightlightThis(this, 1);
    });

    $('.search_dropdown_item').mouseout(function () {
        hightlightThis(this, 0);
    });
}

function showMenu(callingId, menuId) {

    try {
        while (document.getElementsByClassName("search_dropdown_container_show").length > 0) {
            var openDropdown = document.getElementsByClassName("search_dropdown_container_show")[0];
            if (openDropdown.classList.contains('search_dropdown_container_show')) {
                openDropdown.classList.remove('search_dropdown_container_show');
            }
        }

        //$('.menu_item').removeClass('menu_item_selected');

        //if ($('#' + callingId).length > 0) {
        //    $('#' + callingId).addClass('menu_item_selected');
        //}

        var callingIdLeft = $('#' + callingId).position().left - 32;

        $('#' + menuId).css('left', callingIdLeft + 'px');

        var callingIdTop = $('#' + callingId).position().top + 34;

        $('#' + menuId).css('top', callingIdTop + 'px');

        document.getElementById(menuId).classList.toggle("search_dropdown_container_show");
    }
    catch (e) {
    }
}

function hideMenu() {
    while (document.getElementsByClassName("search_dropdown_container_show").length > 0) {
        var openDropdown = document.getElementsByClassName("search_dropdown_container_show")[0];
        if (openDropdown.classList.contains('search_dropdown_container_show')) {
            openDropdown.classList.remove('search_dropdown_container_show');
        }
    }

    $('.menu_item').removeClass('menu_item_selected');
}

function hightlightThis(menuItem, h) {
    if (h == 1) {
        menuItem.classList.add("search_dropdown_container_hightligth")
    }
    else {
        menuItem.classList.remove("search_dropdown_container_hightligth");
        //    $('.menu_item').removeClass('menu_item_active');
    }
}

function fixSelectedOptionPosition(lstId) {
    var lst = $('#' + lstId);
    var s = lst.find(':selected');
    if ($(s).text() != '') {
        var optionTop = lst.find(':selected').offset().top - 34;
        var selectTop = lst.offset().top;
        lst.scrollTop(lst.scrollTop() + (optionTop - selectTop));
    }
}
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < window.innerHeight && rect.bottom > 0
    );
}

//slide
$(function () {
    fixSlideShowLeft();
});

$(window).resize(function () {
    fixSlideShowLeft();
});

function fixSlideShowLeft(h) {

    var container = $('#newsSlideShowLeftColumn');

    // Exit early if the left column is not visible (e.g., display: none)
    if (!container.is(':visible')) {
        return;
    }

    $('#newsSlideShowLeftColumn').css('height', h);
}

var j2 = jQuery.noConflict(true);

function updateActiveItem(event) {
    var container = $('#newsSlideShowLeftColumn');

    // Exit early if the left column is not visible (e.g., display: none)
    if (!container.is(':visible')) {
        return;
    }

    var currentIndex = event.item.index;

    // Find the currently active .owl-item
    var currentOwlItem = j2(event.target).find('.owl-item').eq(currentIndex);

    // Get your actual slide inside it (the direct child of .owl-item)
    var slideDiv = currentOwlItem.children('div');

    fixSlideShowLeft($(slideDiv).css('height'));

    // Now get the ID
    var slideId = slideDiv.attr('id');

    $('.news_item').removeClass('news_item_active');

    //$('#newsItemId_' + slideId.replace(/slideItemId_/gi, '')).addClass('news_item_active');

    var activeNewsItem = $('#newsItemId_' + slideId.replace(/slideItemId_/gi, ''));

    activeNewsItem.addClass('news_item_active');

    // Scroll logic to ensure the item is visible in the left column
    var container = $('#newsSlideShowLeftColumn');
    var containerTop = container.offset().top;
    var containerBottom = containerTop + container.height();

    var itemTop = activeNewsItem.offset().top;
    var itemBottom = itemTop + activeNewsItem.outerHeight(true);

    // If item is not fully visible, scroll to it
    if (itemTop < containerTop || itemBottom > containerBottom) {
        container.animate({
            scrollTop: container.scrollTop() + (itemTop - containerTop)
        }, 300);
    }
}

j2(function () {
    j2('#newsSlide').on('initialized.owl.carousel', function (event) {
        updateActiveItem(event);
    });

    j2('#newsSlide').owlCarousel({
        slideTransition: 'linear',
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: false,
        animateOut: 'fadeOut',
        loop: true,
        lazyLoad: true,
        margin: 0,
        stagePadding: 0,
        responsiveClass: true,
        dots: false,
        navText: ['<div><img src="images/layout/prev.png" width=15 height=46 border=0 style="display:block;margin-left:10px" /></div>', '<div><img src="https://www.tqsqk7.edu.vn/skin/defaultskin/images/layout/next.png" width=15 height=46 border=0 style="display:block;margin-right:10px" /></div>'],
        singleItem: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            240: {
                items: 1,
                nav: true
            },
            320: {
                items: 1,
                nav: true,
                loop: true
            },
            375: {
                items: 1,
                nav: true,
                loop: true
            },

            414: {
                items: 1,
                nav: true,
                loop: true
            },

            480: {
                items: 1,
                nav: true,
                loop: true
            },

            568: {
                items: 1,
                nav: true,
                loop: true
            },

            600: {
                items: 1,
                nav: true,
                loop: true
            },

            736: {
                items: 1,
                nav: true,
                loop: true
            },

            768: {
                items: 1,
                nav: true,
                loop: true
            },

            800: {
                items: 1,
                nav: true,
                loop: true
            },

            1024: {
                items: 1,
                nav: true,
                loop: true
            },

            1440: {
                items: 1,
                nav: true,
                loop: true
            },

            1600: {
                items: 1,
                nav: true,
                loop: true
            },

            2560: {
                items: 1,
                nav: true,
                loop: true
            },

        }
    })

    j2('.owl-carousel').on('changed.owl.carousel', function (event) {
        updateActiveItem(event);
    });
});

//end slide


