(function($){
    "use strict";
    $.fn.extend({
        bootbar: {
            info: function(message, options) {
                options = options === undefined ? {} : options;
                options.barType = "info";
                this.show(message, options);
            },
            warning: function(message, options) {
                options = options === undefined ? {} : options;
                options.barType = "warning";
                this.show(message, options);
            },
            danger: function(message, options) {
                options = options === undefined ? {} : options;
                options.barType = "danger";
                this.show(message, options);
            },
            success: function(message, options) {
                options = options === undefined ? {} : options;
                options.barType = "success";
                this.show(message, options);
            },
            show: function(message, options) {
                var alertTypes = ["info", "warning", "danger", "success"];

                var defaults = {
                        alertClass: "bootbar-alert",    // Default class of the alert is "bootbar-alert"
                        autoDismiss: false,             // Don't automatically dismiss the bar.
                        autoLinkClass: true,            // onDraw callback
                        barType: alertTypes[0],         // info
                        dismissTimeout: 3000,           // 3 Seconds
                        dismissEffect: "slide",         // Slide away: (slide, fade)
                        dismissSpeed: "fast",           // Dismiss speed: (slow, fast)
                        onDraw: null,                   // onDraw callback
                        onDismiss: null                 // onDismiss callback
                };

                this.settings = $.extend({}, defaults, options || {});

                this.template = $("<div>" +
                                    "<button type=\"button\" class=\"close\" aria-hidden=\"true\">&times;</button>" +
                                "</div>");

                var alertCss = {
                    position  : "fixed",
                    left: 0,
                    top: 0,
                    right: 0,
                    "z-index": 10000
                };

                this.template.css(alertCss);

                // Add the class from options (if provided)
                this.template.addClass("bootbar-alert alert alert-dismissable");
                this.template.addClass("alert-" + this.settings.barType);
                this.template.addClass(this.settings.alertClass);
                this.template.append(message);
                this.template.alertClass = this.settings.alertClass;

                if (this.settings.autoLinkClass) {
                    this.template.find("a").addClass("alert-link");
                }

                var that = this;
                $("body").prepend(this.template).each(function() {
                    if ($.isFunction(that.settings.onDraw)) {
                        that.settings.onDraw.call(this);
                    }
                });

                $(this.template).find(".close").unbind("click");

                $(this.template.find(".close")).on("click", function() {
                    that.dismiss();
                });

                // Auto dismiss
                // Bind the function to the current element (otherwise this = window)
                if (this.settings.autoDismiss) {
                    setTimeout(this.dismiss(), this.settings.dismissTimeout);
                }

                return this;
            },
            transitionOut: function() {
                if (!this.settings) {
                    return this;
                }
                var dismissEffect = this.settings.dismissEffect;
                var dismissSpeed = this.settings.dismissSpeed;
                var onDismiss = this.settings.onDismiss;
                if (dismissEffect === "slide") {
                    $(this.template).slideUp(dismissSpeed, function() {
                        $(".bootbar-alert").remove();
                        if ($.isFunction(onDismiss)) {
                            onDismiss.call(this);
                        }
                    });
                } else {
                    $(this.template).fadeOut(dismissSpeed, function() {
                        $(".bootbar-alert").remove();
                        if ($.isFunction(onDismiss)) {
                            onDismiss.call(this);
                        }
                    });
                }
                return this;
            },
            dismiss: function() {
                this.transitionOut.call(this);
            },
            hide: function() {
                $(this.template).remove();
            }
        }
    });
})(window.jQuery || window.Zepto || window.$);
