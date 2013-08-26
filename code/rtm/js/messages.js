$(document).ready(function(){
    if (window.webkitNotifications.checkPermission() == 1) {
        $('.center-section').prepend(getNotificationPermissionsDialog());
        getNotificationPermissionsDialog().show();
        window.webkitNotifications.requestPermission();
    }
});
function getNotificationPermissionsDialog() {
    return $('.lang.' + getLanguage() + '.notification-permissions');
}
function requestPermissionsAndHideButton() {
    window.webkitNotifications.requestPermission(function(){
        if (window.webkitNotifications.checkPermission() != 1) {
            getNotificationPermissionsDialog().hide();
        }
    });
}
function showMessage(message, callback) {
    callback = callback || Ext.emptyFn;
    if (window.webkitNotifications.checkPermission() == 0) {
        var notification = window.webkitNotifications.createNotification('', 'RTM Pomodoro', message);
        notification.onclick = function(){
            window.focus();
            notification.close();
        };
        notification.onclose = callback;
        notification.show();
    } else {
        alert(message);
        callback();
    }
}
