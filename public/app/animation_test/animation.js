$(document).ready(function() {
    $('.row').css("visibility", "visible").hide().fadeTo(1000, 1);
    $('.toggled').hide();
    
    $('.toggle').click(function() {
        $('.toggled').slideToggle();
    });
});