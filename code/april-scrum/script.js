$(function() {
    var title = $(".title"),
        subTitle = $(".sub-title"),
        slideTitle = $.merge(title, subTitle),
        slide = $(".slide"),
        tasks = $(".task"),
        taskDetails = $(".task-details");

    slideTitle.on("click", function() {
        slideTitle.removeClass("super-inactive").toggleClass("active").toggleClass("inactive");
        slide.toggleClass("hidden");
        tasks.removeClass("active").removeClass("inactive")
        taskDetails.slideUp();
    });

    tasks.on("click", function() {
        var task = $(this);
        task.siblings().removeClass("active").addClass("inactive").children(".task-details").slideUp();
        task.removeClass("inactive").addClass("active").children(".task-details").slideDown();
        slideTitle.addClass("super-inactive");
    });
});