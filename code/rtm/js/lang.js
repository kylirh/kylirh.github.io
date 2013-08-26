function getLanguage() {
    var language = window.navigator.userLanguage || window.navigator.language;
    if (language.indexOf('ru') == 0) {
        return 'ru';
    } else if (language.indexOf('ja') == 0) {
        return 'ja';
    } else {
        return 'en';
    }
}
$(document).ready(function(){
    var language = getLanguage();
    $('.lang').hide();
    $('.lang').filter('.' + language).show();
});