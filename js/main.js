(function($) {
    $(document).ready(function() {
        'use strict';

        // Replace no-js and adjust touch classes  
        ! function() {
            document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/, 'js');
            var yesIfTouchDevice = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
            if (yesIfTouchDevice) {
                document.documentElement.className += " touch";
            } else {
                document.documentElement.className += " no-touch";
            }
        }();
        //replacing no-js and touch finishes

        // Global Module starts: For user agent device details
        var userAgent = function() {
            var yesIfTouchDevice = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
            var yesIfRatina = (window.devicePixelRatio > 1);

            function isTouchDevice() {
                return yesIfTouchDevice;
            }

            function isRatina() {
                return yesIfRatina;
            }

            function width() {
                return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            }


            return {
                isTouchDevice: isTouchDevice,
                isRatina: isRatina,
                width: width
            }
        }();
        // Global Module finishes: User Agent


        // Custom cookie global object to store all cookie related stuff
        var cookie = function() {
            function setCookie(name, value, expires, path, domain) {
                //value MUST NOT BE encoded and expires must me of UTC/GMT format
                var cookie = name + "=" + encodeURIComponent(value) + ";";
                if (!!expires) {
                    cookie += "expires=" + expires + ";";
                }
                if (!!path) {
                    cookie += "path=" + path + ";";
                }
                if (domain) {
                    cookie += "domain=" + domain + ";";
                }
                document.cookie = cookie;
            };

            function getCookie(cname) {
                var name = cname + "=";
                //cookie value must alwasy be encoded with uriEncodeComponent
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }

            return {
                setCookie: setCookie,
                getCookie: getCookie
            }

        }();






        if ($("body").hasClass("page-id-homepage")) {


            //Global blazy module starts
            var bLazy = new Blazy({

                breakpoints: [{
                    width: 767, //max-width
                    src: 'data-src-small'
                }],

                success: function(ele) {
                    $(ele).closest('.image-wrapper').addClass('image-loaded');
                },
                error: function(ele, msg) {

                    var image = $(ele)[0];
                    if (msg === 'missing') {
                        console.warn("Custom ERROR: ", image, " data-src is missing\n");
                    } else if (msg === 'invalid') {
                        console.warn("Custom ERROR: ", image, " data-src is invalid\n");
                    }
                }
            });
            //Global blazy module finishes




        }

        // flexslider starts
        ! function() {
            if ($("body").hasClass("page-id-homepage")) {

                var Margin = 10; // Right margin of thumbnail in bottom carousel 
                var Size; // Number of thumbnails


                function sizer() {
                    if (userAgent.width() < 768) {
                        Size = 3;
                    } else {

                        Size = 4;
                    }
                }
                sizer();

                // The slider being synced must be initialized first
                $('#flex-carousel-H').flexslider({
                    animation: "slide",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    itemWidth: 320,
                    itemMargin: Margin,
                    touch: true,
                    maxItems: Size,
                    minItems: Size,
                    asNavFor: '#flex-slider-H',
                    after: function(slider) {
                        bLazy.revalidate();
                    },
                    start: function() {
                        //global.bLazy.revalidate();
                    }
                });

                $('#flex-slider-H').flexslider({
                    animation: "slide",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    sync: "#flex-carousel-H",
                    after: function(slider) {
                        if (!!slider.currentSlide) {
                            // This if will avoid touch down bug for first image on touch devices https://github.com/woocommerce/FlexSlider/issues/1638
                            bLazy.revalidate();
                        }
                        var index = $("#flex-slider-H .slides li.flex-active-slide").index();
                        if (!!$("#flex-slider-H .descriptions > .flex-caption.active").length) {
                            $("#flex-slider-H .descriptions > .flex-caption.active").removeClass("active");
                            $("#flex-slider-H .descriptions > .flex-caption").eq(index).addClass("active");
                        }
                    },
                    start: function() {

                    }
                });

                $(".flex-prev").html("<span class='visuallyhidden'>Previous</span>");
                $(".flex-next").html("<span class='visuallyhidden'>Next</span>");

                function flexSizer() {
                    $(window).off("resize", flexSizer);

                    for (var i = 1; i < 5; i++) {
                        setTimeout(function() {
                            sizer();
                            $('#flex-carousel-H').data('flexslider').vars.minItems = Size;
                            $('#flex-carousel-H').data('flexslider').vars.maxItems = Size;
                            $('#flex-carousel-H').data('flexslider').vars.itemMargin = Margin;
                            $('#flex-carousel-H').data('flexslider').resize();
                            $('#flex-slider-H').data('flexslider').resize();
                        }, i * 250);
                    }

                    setTimeout(function() {
                        sizer();
                        $('#flex-carousel-H').data('flexslider').vars.minItems = Size;
                        $('#flex-carousel-H').data('flexslider').vars.maxItems = Size;
                        $('#flex-carousel-H').data('flexslider').vars.itemMargin = Margin;
                        $('#flex-carousel-H').data('flexslider').resize();
                        $('#flex-slider-H').data('flexslider').resize();
                        $(window).on("resize", flexSizer);
                    }, 1300);

                }

                flexSizer(); // unknown buggy hack to set thumbnails propery on domready. plus set wondow.resize            

                if (!userAgent.isTouchDevice()) {


                    var clicker;
                    var direction;
                    $("#flex-carousel-H .flex-direction-nav a").mouseenter(function() {
                        if ($(this).hasClass("flex-next")) {
                            direction = "next";
                        } else {
                            direction = "prev";
                        }
                        $('#flex-carousel-H').flexslider(direction);
                        clicker = setInterval(function() {
                            $('#flex-carousel-H').flexslider(direction);
                        }, 1650);
                    });
                    $("#flex-carousel-H .flex-direction-nav a").mouseleave(function() {
                        clearInterval(clicker);
                    });
                    $("#flex-carousel-H .flex-direction-nav a").click(function() {
                        clearInterval(clicker);
                        $(this).trigger("mouseenter");
                    });


                    $("#flex-carousel-H .slides > li").mouseenter(function() {
                        $(this).trigger("click");
                    });

                    $("#flex-slider-H").hover(function() {
                        var index = $("#flex-slider-H .slides li.flex-active-slide").index();
                        $("#flex-slider-H .descriptions > .flex-caption").eq(index).addClass("active");
                    }, function() {
                        $("#flex-slider-H .descriptions > .active").removeClass("active");
                    });
                }

                //email and phone traingular canvas starts 
                /* 
                $.each($(".skew-triangle"), function() {
                    var canvas = this;
                    if (canvas.getContext) {
                        var ctx = canvas.getContext('2d');
                        ctx.fillStyle = "#f5f5f5";
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(15, 28);
                        ctx.lineTo(0, 56);
                        ctx.fill();
                    }
                });

                 $.each($(".db-triangle"), function() {
                    var canvas = this;
                    if (canvas.getContext) {
                        var ctx = canvas.getContext('2d');
                        ctx.fillStyle = "#f5f5f5";
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(15, 0);
                        ctx.lineTo(15, 56);
                        ctx.lineTo(0, 56);
                        ctx.lineTo(15, 28);
                        ctx.lineTo(0, 0);
                        ctx.fill();
                    }
                });
                */

                //touch devices content on slide functionality  

                $(".touch .desc-list .circular-overlay").click(function(e) {
                    e.stopPropagation();
                });

                $(".touch .desc-list").click(function(e) {

                    var index = $("#flex-slider-H .slides li.flex-active-slide").index();
                    if (!$("#flex-slider-H .descriptions > .flex-caption.active").length) {
                        $("#flex-slider-H .descriptions > .flex-caption.active").removeClass("active");
                        $("#flex-slider-H .descriptions > .flex-caption").eq(index).addClass("active");
                    } else {
                        $("#flex-slider-H .descriptions > .flex-caption.active").removeClass("active");
                    }

                    $("#flex-slider-H").toggleClass("open");

                    if ($("#flex-slider-H").hasClass("open")) {
                        $(document).on("click.desc", function(e) {
                            if (!$(e.target).closest("#flex-slider-H").length) {
                                $("#flex-slider-H").removeClass("open");
                                $("#flex-slider-H .descriptions > .flex-caption.active").removeClass("active");
                                $(document).off("click.desc");

                            }
                        });
                    } else {
                        $(document).off("click.desc");
                    }

                });

            }


        }();
        //Flex slider finishes


        //MODULE starts: working of recuerdo-rose like pop up on all links
        ! function() {

            $(".pop-container .link-description").each(function() {
                var str = $(this).text().trim().length;
                if (str < 25) {
                    $(this).addClass("max-25");
                } else if (str < 50) {
                    $(this).addClass("max-50");
                } else if (str < 100) {
                    $(this).addClass("max-100");
                }
            });

            $(".no-touch .pop-link").hover(function() {
                $(this).siblings(".link-description").addClass("active");
            }, function() {
                $(this).siblings(".link-description").removeClass("active");
            });

            $(".touch .plus").click(function(e) {
                $(this).closest(".pop-container").toggleClass("active");
                $(this).parent("h1").toggleClass("active");
                e.preventDefault();
            });

            $(".touch .pop-container-social .icon").on("click", function() {
                $(this).parent(".pop-container-social").toggleClass("active");

            });

            $(document).on("click.popups", function(e) {

                var popContainer = $(e.target).closest(".pop-container");

                $(".pop-container").not(popContainer).children("h1").removeClass("active");
                $(".pop-container").not(popContainer).removeClass("active");

            });



        }();
        //MODULE finishes: working of recuerdo-rose like pop up on all links



        //Namespace starts: marquee both V and H
        ! function() {
            if ($("body").hasClass("page-id-homepage")) {


                $(".marquee").on("revalidate", function() {
                    if ($(this).find(".marquee-content").eq(1).length) {
                        $(this).siblings(".backward, .forward").removeClass("invisible");
                    } else {
                        $(this).siblings(".backward, .forward").addClass("invisible");
                    }
                });

                //marquee common rules for V and H
                $(".marquee").marquee(); //initialization


                $(".no-touch .marquee").siblings(".backward").hover(function() {
                    $(this).siblings(".marquee").trigger("backward");
                }, function() {
                    $(this).siblings(".marquee").trigger("pause");
                });

                $(".no-touch .marquee").siblings(".forward").hover(function() {
                    $(this).siblings(".marquee").trigger("forward");

                }, function() {
                    $(this).siblings(".marquee").trigger("pause");
                });

                $(".no-touch .marquee").on("mouseleave", function() {
                    $(this).trigger("pause");
                });

                $(".no-touch .marquee").on("mouseenter", function() {
                    var hoverMethod = $(this).data("hoverMethod");
                    if (!!hoverMethod) {
                        $(this).trigger(hoverMethod);
                    }
                });


                $(".touch .marquee").siblings(".backward").on("click", function() {
                    $(this).siblings(".marquee").trigger("backward");
                });

                $(".touch .marquee").siblings(".forward").on("click", function() {
                    $(this).siblings(".marquee").trigger("forward");
                });

                $(".touch .marquee").on("click", function() {
                    $(this).trigger("pause");
                });





                /*
         //Module starts: mousemove scrolling of marquee-veritcal
         ! function() {


             //Replaced mousemove with mouseleave and added arrow signs

             var $backward = false; //is running backward?
             var $forward = false; //is running forward?

             function autoscroller(e) {
                 $(this).off("mousemove", autoscroller);
                 var that = this; //so that `this` could be used inside timeout
                 setTimeout(function() {

                     var y = e.pageY - $(that).offset().top;

                     if ((y <= 50) && ($backward == false)) {
                         $backward = true;
                         $(that).find(".marquee").trigger("backward");
                     } else if ((y >= ($(that).outerHeight() - 50)) && ($forward == false)) {
                         $forward = true;
                         $(that).find(".marquee").trigger("forward");
                     } else if ((y > 50) && (y < $(that).outerHeight() - 50)) {
                         $backward = $forward = false;
                         $(that).find(".marquee").trigger("pause");
                     }

                     $(that).on("mousemove", autoscroller);
                 }, 50);
             }

             $(".no-touch .flex-caption").on("mousemove", autoscroller);



             $(".no-touch .flex-caption").on("mouseleave", function() {
                 var that = this;
                 setTimeout(function() {
                     $backward = $forward = false;
                     $(that).find(".marquee").trigger("pause");
                 }, 70);
             });




         }();
         //Module starts: mousemove scrolling of marquee


         //Module starts: mousemove scrolling of marquee-horizontal
         ! function() {
             var $backward = false; //is running backward?
             var $forward = false; //is running forward?

             function autoscroller(e) {

                 $(this).off("mousemove", autoscroller);
                 var that = this; //so that `this` could be used inside timeout
                 setTimeout(function() {

                     var x = e.pageX - $(that).offset().left;

                     if ((x <= 30) && ($backward == false)) {
                         $backward = true;
                         $(that).find(".marquee").trigger("backward");

                     } else if ((x >= ($(that).outerWidth() - 30)) && ($forward == false)) {

                         $forward = true;
                         $(that).find(".marquee").trigger("forward");
                     } else if ((x > 50) && (x < $(that).outerWidth() - 50)) {

                         $backward = $forward = false;
                         $(that).find(".marquee").trigger("pause");
                     }

                     $(that).on("mousemove", autoscroller);
                 }, 50);
             }

             $(".no-touch .address").on("mousemove", autoscroller);

             $(".no-touch .address").on("mouseleave", function() {
                 var that = this;
                 setTimeout(function() {
                     console.log("out");
                     $backward = $forward = false;
                     $(that).find(".marquee").trigger("pause");
                 }, 70);
             });
            

         }();
         //Module starts: mousemove scrolling of marquee-horizontal
        */

            }
        }();
        //Namespace marquee both V and H ends



        // yaml content ajax loading module starts (this feauture has been removed and this portion can be removed)
        ! function() {
            if ($("body").hasClass("page-id-policy3") && $("html").hasClass("no-touch")) {

                /*
                    //commented out because we need simpler json/yaml format
                 var jsonData = window.globalJsonData.policy;

                 $("header h1").prepend($("<div/>").text(jsonData.header.title));
                 $("header .inverse-skew").prepend($("<div/>").text(jsonData.header.description));

                 function recursiveHtmlAppender(data, ele) {
                     if ($.type(data) == "array") {
                         for (var i = 0; i < data.length; ++i) {

                             var key = Object.keys(data[i])[0];
                             ele.append("<" + key + ">");
                             var new_ele = ele.children().last();

                             recursiveHtmlAppender(data[i][key], new_ele);
                         }
                     } else {
                         ele.append(data);
                     }
                 }

                 recursiveHtmlAppender(jsonData.content, $("body > .container"));

                 */

                YAML.load('policy3.yaml', function(data) {

                    for (var prop in data.content) {
                        $('[data-yaml = "' + prop + '"]').prepend(data.content[prop]);
                    }

                    for (var prop in data.links) {
                        $('[data-link = "' + prop + '"]').attr("href", data.links[prop]);
                    }
                });

            }
        }();
        // yaml module finishes


        //Captcha chat module starts 
        ! function() {
            if ($("body").hasClass("page-id-homepage")) {

                var protocol = location.protocol;
                var domain = location.hostname + location.pathname;

                if (!cookie.getCookie("chat_captcha_solved") || protocol == "http:") {

                    var timeout; // Id of setInterval -- glabal so that never overriden on redeclaration

                    $(".captcha-chat").show();
                    var captcha = new $.Captcha({
                        onFailure: function() {

                            $(".captcha-chat .wrong").show({
                                duration: 30,
                                done: function() {
                                    var that = this;
                                    clearTimeout(timeout);
                                    $(this).removeClass("shake");
                                    $(this).css("animation");
                                    //Browser Reflow(repaint?): hacky way to ensure removal of css properties after removeclass
                                    $(this).addClass("shake");
                                    var time = parseFloat($(this).css("animation-duration")) * 1000;
                                    timeout = setTimeout(function() {
                                        $(that).removeClass("shake");
                                    }, time);
                                }
                            });

                        },

                        onSuccess: function() {
                            cookie.setCookie("chat_captcha_solved", "YES");
                            if (protocol == "http:") {
                                location.replace("https://" + domain);
                                $("#captcha .refresh, #captcha .validate").off("click.captcha");                                
                                $("#captcha .user-text").off("keypress.captcha");
                                $(".captcha-chat .wrong").hide();
                                $(".captcha-chat .redirecting").show();
                            } else if (protocol == "https:") {
                                $(document).trigger("captchaSolved");
                                $(".captcha-chat .wrong").hide();
                                $(".captcha-chat .captcha_loading").show();
                                $("#captcha .refresh, #captcha .validate").off("click.captcha");                                
                                $("#captcha .user-text").off("keypress.captcha");
                                //fire drift show event and catch that in drift ready
                                //now start showing loading in canvas
                            }
                        }
                    });

                    captcha.generate();

                    if (!userAgent.isTouchDevice()) {
                        $(".chat-icon").mouseenter(function() {
                            $(".captcha-container").toggleClass("shown");
                        });
                    } else {
                        $(".chat-icon").click(function() {
                            $(".captcha-container").toggleClass("shown");
                        });
                    }

                } 
                
                drift.on('ready', function(api, payload) {
                    
                    if (!cookie.getCookie("chat_captcha_solved") || protocol == "http:") {                        
                        api.widget.hide();
                    }

                    else {
                        $(".captcha-chat").hide();
                        api.sidebar.open();
                    }

                    $(document).on("captchaSolved", function(){
                        $(".captcha-chat").hide();                        
                        api.widget.show();
                        api.sidebar.open();
                    });

                });
                              

            }
        }();
        //captcha chat module finishes


        //Custom marquee for whole policy page  
        // I didn't use marqueedirection plugin because it creates a copy of whole marquee content.  
        ! function() {
            if ($("body").hasClass("page-id-policy") && $("html").hasClass("no-touch")) {

                var movingUp = false;
                var movingDown = false;

                var speed = $("body").data("speed");

                function throttleScroller(e) {
                    $(window).off("mousemove.marquee");
                    var throttle = setTimeout(function() {

                        var y = e.clientY;
                        var scrollPos = $("body").scrollTop();
                        var scrollHeight = $("body").prop('scrollHeight');
                        var bottomZone = $(window).height() - 100;

                        if ((y < 100) && (movingUp == false) && (scrollPos != 0)) {

                            movingUp = true;
                            movingDown = false;
                            var remainingTime = (scrollPos * 100) / speed;

                            $("body").stop("marqueeQueue");

                            $("body").animate({
                                scrollTop: 0
                            }, {
                                duration: remainingTime,
                                easing: "linear",
                                queue: "marqueeQueue"
                            }).dequeue("marqueeQueue");
                        } else if ((y > bottomZone) && (movingDown == false) && (scrollPos != scrollHeight)) {

                            movingDown = true;
                            movingUp = false;

                            var remainingTime = (scrollHeight - scrollPos) * 100 / speed;

                            $("body").stop("marqueeQueue");

                            $("body").animate({
                                scrollTop: scrollHeight
                            }, {
                                duration: remainingTime,
                                easing: "linear",
                                queue: "marqueeQueue"
                            }).dequeue("marqueeQueue");
                        } else if ((y <= bottomZone) && (y >= 100)) {
                            movingDown = false;
                            movingUp = false;
                            $("body").stop("marqueeQueue");
                        }

                        $(window).on("mousemove.marquee", throttleScroller);
                    }, 100);
                }
                $(window).on("mousemove.marquee", throttleScroller);

            }
        }();












        // loading gif whole page starts 
        //must be at second last beofre cookie banner of js file  
        //so that loader hides at last
        ! function() {

            $(".loading").fadeOut(500);
            $(".container").delay(500).css("visibility", "visible").fadeTo(500, 1, function() {
                if ($("body").hasClass("page-id-homepage")) {
                    bLazy.revalidate();
                }
            });
        }();

        //cookie banner to show for first time visitor 
        //must be at last of every thing 
        ! function() {

            if ($("body").hasClass("page-id-homepage")) {
                if ( !cookie.getCookie("ever_visited_flat") ) {

                    var expires = new Date();
                    expires.setFullYear(expires.getFullYear() + 1);
                    expires = expires.toUTCString();

                    cookie.setCookie("ever_visited_flat", "YES", expires);
                    //alert("set cookie for first visit");

                    $("footer .cookies").show();

                    $("footer .cookies").addClass("fadein");

                    var hasrun = false;

                    function cookieHider() {
                        $(document).off(allEvents, cookieHider);
                        if (!hasrun) {
                            hasrun = true;                            
                            $("footer .cookies").delay(2000).queue(function() {
                                console.log("2 sec passed");
                                $(this).addClass("fadeout").dequeue();
                            }).delay(3000).queue(function() {
                                console.log("5 sec passed");
                                $(this).hide().dequeue();
                            });
                        }
                    }

                    //all events exept onload ready etc
                    var allEvents = 'blur change click contextmenu dblclick error focus focusin focusout hover keydown keyup keypress mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup scroll select submit touchstart wheel';
                    $(document).one(allEvents, cookieHider);
                }

            }
        }();

    });
})(jQuery);
