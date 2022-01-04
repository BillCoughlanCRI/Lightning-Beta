$(function() {
    var $window = $(window);
    var $header = $('header');
    var $nav = $header.find('nav');
    var $body = $('body');
    var $main = $('main');
    var $sections = $main.find('section');
    var $footer = $('footer');

    // Window sizes
    var sm = 768;
    var md = 992;
    var lg = 1200;

    /**
     * Set min-height for each homepage section
     */
    function set_section_height() {
        var height = window.innerHeight - $header.height();
        $sections.css('minHeight', height);
    }

    /**
     * Prevent a[href=#] from jumping
     */
    function disable_empty_anchors() {
        $('a[href="#"]').click(function(e) {
            e.preventDefault();
        });
    }

    /**
     * Set footer year
     */
    function set_footer_year() {
        var year = new Date().getFullYear();
        $footer.find('.year').html(year);
    }

    /**
     * Refresh when the screen resizes above or below 768px width
     */
    function refresh_on_resize_mobile() {
        var window_width = window.innerWidth;

        $(window).resize(function() {

            // Refresh when the current width subceeds 768 and the set width is over 768,
            // Or when the current width exceeds 768 and the set width is below 768
            if (window_width >= sm && window.innerWidth < sm || window_width < sm && window.innerWidth >= sm) {
                window.location.reload();
            }

            // Remove active class when nav switches layouts
            if (window_width >= lg && window.innerWidth < lg || window_width < lg && window.innerWidth >= lg) {
                $nav.removeClass('active');
            }
        });
    }

    /**
     * Navigation
     */

     function close_nav() {
        $nav.removeClass('active');
        $nav.find('.active').removeClass('active');

        if ($window.width() >= lg) {
            $nav.find('ul ul').fadeOut();
        } else {
            $nav.find('ul ul').hide();
        }
    }

    function navigation() {

        // Toggle mobile nav
        var $toggle = $nav.find('.toggle');

        $toggle.click(function() {
            $nav.toggleClass('active');
            
            if ($window.width() < sm) {
                $body.toggleClass('stuck', $nav.hasClass('active'));
            }

            if (!$nav.hasClass('active')) {
                close_nav();
            }
        });

        // Expand menu sections
        $nav.find('li > a').click(function() {
            var $li = $(this).parent();
            var $ul = $(this).siblings('ul');

            if ($ul.length) {
                $li.toggleClass('active');

                setTimeout(function() {
                    if ($li.hasClass('active')) {
                        if ($window.width() >= lg) {
                            $ul.fadeIn().css('display', 'block');

                        } else {
                            $ul.slideDown();
                        }

                    } else {
                        $li.find('.active').removeClass('active');

                        if ($window.width() >= lg) {
                            $ul.fadeOut();

                        } else {
                            $ul.slideUp();
                            $li.find('ul').slideUp();
                        }
                    }
                }, 50);
            }

            // Collapse sibling sections
            var $lis = $li.siblings();
            var $uls = $lis.find('ul');

            $lis.removeClass('active');
            $uls.find('.active').removeClass('active');

            if ($window.width() >= lg) {
                $uls.fadeOut();

            } else {
                $uls.slideUp();
            }
        });

        // Close nav on outside click
        $body.click(function(e) {
            var condition = !$nav.find(e.target).length && ($window.width() >= lg && $nav.find('.active') || $window.width() < lg && $nav.hasClass('active'));
            if (condition) {
                close_nav();
            }
        });
    }

    /**
     * Distribute nav child links into columns on desktop 
     */
    function sub_nav_columns() {
        if ($window.width() >= lg) {
            $nav.find('ul ul ul').each(function() {
                var count = $(this).children().length;
                var columns = count >= 8 ? 3 : count >= 4 ? 2 : 1;
                $(this).css('column-count', columns);
            });
        } else {
            $nav.find('ul ul ul').css('column-count', '');
        }
    }

    /**
     * Toggle search bar
     */
    function toggle_search() {
        var $search = $header.find('.search');
        var $input = $search.find('input');

        $search.find('button').click(function() {

            // If on tablet or desktop, activate/deactivate search
            if ($window.width() >= sm) {
                $header.toggleClass('active_search');

                setTimeout(function() {
                    if ($header.hasClass('active_search')) {
                        $input.focus();
                    } else {
                        $input.blur();
                    }
                }, 750);

            // If on mobile, search
            } else {
                // Search
            }
        });
    }

    /**
     * Homepage pagination
     */
    function section_pagination() {
        var $pagination = $header.find('> .pagination');

        // The number of dots should be equal to the number of sections
        $pagination.html('');

        for (i = 0; i < $sections.length; i++) {
            $pagination.append('<a href="#"></a>');
        }

        var $pagination_a = $pagination.find('a');

        $pagination_a.eq(0).addClass('active');

        // Progress the active dot on scroll
        $(document).scroll(function() {
            var n = 0;

            // If a section is at least halfway up the page, set it as active
            $sections.each(function() {
                n = $(window).scrollTop() >= ($(this).offset().top - ($(window).height() / 2)) - ($header.height() / 2) ? $(this).index() : n;
            });

            $pagination.find('.active').removeClass('active');
            if (n) {
                $pagination_a.eq(n).addClass('active');
            } else {
                $pagination_a.eq(n).addClass('active');
            }

        });

        // Scroll to section
        $pagination_a.click(function() {
            var a_n = $(this).index();

            if (!$(this).hasClass('active')) {
                $('html, body').animate({
                    scrollTop: $sections.eq(a_n).offset().top - $header.height()
                });
            }
        });
    }

    /**
     * Store and then populate email address field for demo booking
     */
    function store_and_get_booking_email() {
        $('label.demo button').click(function() {
            var email = $(this).closest('label').find('input').val();
            if (email !== '') {
                sessionStorage.demo_email = email;
            }
        });

        // Now do the populating
    }

    /**
     * Online tools accordion
     */
    function resize_accordion() {
        var $online_tools = $('#online_tools');

        // Set equal heights for accordion text
        var intro_height = 0;
        var $intros = $online_tools.find('.intro');
        var full_height = 0;
        var $fulls = $online_tools.find('.full');

        $intros.height('');
        $fulls.height('');

        $intros.each(function() {
            intro_height = $(this).height() > intro_height ? $(this).height() : intro_height;
        });

        $fulls.each(function() {
            full_height = $(this).height() > full_height ? $(this).height() : full_height;
        });

        $intros.height(intro_height);
        $fulls.height(full_height);
    }

    function online_tools_accordion() {
        var $online_tools = $('#online_tools');

        // Tablet and Desktop
        if (window.innerWidth >= sm) {

            // Click section to expand and toggle to collapse
            $online_tools.find('> div').click(function(e) {
                var $siblings = $(this).siblings();
                var $toggle = $(this).find('.toggle');

                if ($(this).hasClass('active') && e.target === $toggle[0]) {
                    $(this).attr('class', '');
                    $siblings.attr('class', '');
                    $toggle.attr('title', 'Expand');
                } else {
                    $(this).attr('class', 'active');
                    $siblings.attr('class', 'inactive');
                    $toggle.attr('title', 'Collapse');
                }
            });

            resize_accordion();

        // Mobile
        } else {

            // Click toggle to expand and collapse
            $online_tools.find('.toggle').click(function() {
                var $div = $(this).closest('section > div');
                var $full = $div.find('.full');
                var $siblings = $div.siblings();
                $div.toggleClass('active');

                if ($div.hasClass('active')) {
                    $full.slideDown(1000);
                    $siblings.removeClass('active');
                    $siblings.find('.full').slideUp(1000);

                    // Scroll to active section
                    setTimeout(function() {
                        var offset = $div.offset().top - $header.height();
                        $('html, body').animate({
                            scrollTop: offset
                        }, 500);
                    }, 1000);

                } else {
                    $full.slideUp(1000);
                }

            });
        }
    }

    /**
     * Support card carousel
     */
    function support_card_carousel() {
        var $support = $('#support');
        var $filters = $support.find('.filters');
        var $carousel = $support.find('.carousel');
        var $carousel_inner = $carousel.find('.inner');
        var $cards = $carousel.find('.card');
        var $actions = $support.find('.actions');
        var card_topic;

        $filters.find('li').click(function() {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');

            // Hide/show cards depending on topic
            card_topic = $(this).attr('data-topic') ? $(this).attr('data-topic') : '';

            $filters.toggleClass('filtered', card_topic !== '');

            $cards.each(function() {
                if (window.innerWidth < sm) {
                    // Reset swipe progression
                    $(this).attr('class', 'card');
                }

                if (card_topic !== '') {
                    $(this).toggle($(this).attr('data-topics') === card_topic);
                } else {
                    $(this).show();
                }
            });

            if (window.innerWidth < sm) {
                var $visible_cards = $('.card:not([style*=none])');
                $visible_cards.eq(0).attr('class', 'card active');
                $visible_cards.eq(1).attr('class', 'card next');
            }

        });

        if (window.innerWidth < sm) {

            /**
             * Card swiping with filters
             * Mobile only
             */

            $filters.find('li').click(function() {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
    
                // Hide/show cards depending on topic
                card_topic = $(this).attr('data-topic') ? $(this).attr('data-topic') : '';
    
                $filters.toggleClass('filtered', card_topic !== '');
    
                $cards.each(function() {
                    if (window.innerWidth < sm) {
                        // Reset swipe progression
                        $(this).attr('class', 'card');
                    }
    
                    if (card_topic !== '') {
                        $(this).toggle($(this).attr('data-topics') === card_topic);
                    } else {
                        $(this).show();
                    }
                });
    
                if (window.innerWidth < 768) {
                    var $visible_cards = $('.card:not([style*=none])');
                    $visible_cards.eq(0).attr('class', 'card active');
                    $visible_cards.eq(1).attr('class', 'card next');
                }
    
            });

            $cards.eq(0).attr('class', 'card active');
            $cards.eq(1).attr('class', 'card next');

            $cards.on('swipeleft', function() {
                var $active_card = $carousel.find('.card.active');
                var $next_cards = $active_card.nextAll('.card:not([style*=none])');

                if ($next_cards.eq(0).length) {
                    $active_card.attr('class', 'card seen');
                    $next_cards.eq(0).attr('class', 'card active');

                    if ($next_cards.eq(1).length) {
                        $next_cards.eq(1).attr('class', 'card next');
                    }
                } else {
                    return false;
                }
            });

            $cards.on('swiperight', function() {
                var $active_card = $carousel.find('.card.active');
                var $previous_cards = $active_card.prevAll('.card:not([style*=none])');
                var $next_cards = $active_card.nextAll('.card:not([style*=none])');

                if ($previous_cards.eq(0).length) {
                    $active_card.attr('class', 'card next');
                    $previous_cards.eq(0).attr('class', 'card active');

                } else {
                    return false;
                }

                if ($next_cards.eq(0).length) {
                    $next_cards.eq(0).attr('class', 'card next');
                    $next_cards.eq(0).nextAll().attr('class', 'card');
                }
            });

        } else {

            /**
             * Card carousel with Slick filters
             * Tablet and Desktop only
             */

             $carousel_inner.slick({
                dots: true,
                draggable: false,
                infinite: false,
                speed: 1000,
                slidesToShow: 5,
                slidesToScroll: 5,
                responsive: [
                {
                  breakpoint: 1900,
                  settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                  }
                },
                {
                  breakpoint: 992,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                  }
                },
                {
                  breakpoint: 768,
                  settings: 'unslick'
                }
                ]
            });

            // Filters via Slick for Tablet and Desktop
            $filters.find('li').click(function() {
                var topic = $(this).attr('data-topic') ? $(this).attr('data-topic') : '';
                
                if (topic && topic !== '') {
                    $carousel_inner.slick('slickUnfilter');
                    $carousel_inner.slick('slickFilter', function() {
                        return $(this).attr('data-topics') == topic;
                    });
                    $carousel_inner.find('.slick-slide').show();

                } else {
                    $carousel_inner.slick('slickUnfilter');
                }
            });
        }

        /**
         * Flip cards to reveal additional information
         * Mobile, Tablet and Desktop
         */

        $cards.click(function(e) {
            
            // If on mobile, the card should only flip if it's active (on top of the rest
            if (window.innerWidth < 768 && $(this).hasClass('active') || window.innerWidth >= 768) {

                // Follow link if clicked, otherwise flip the card
                if (e.target.tagName === 'A') {
                    return false;
                } else {
                    $(this).toggleClass('flip');
                    $(this).siblings().removeClass('flip');
                }
            } 
        });
    }

    /**
     * Card carousel with Slick filters
     * 
     */
    function expert_carousel() {
        var $filters = $('#experts .filters');
        var $carousel = $('#experts .carousel');
        var $carousel_inner = $carousel.find('.inner');

        $filters.find('a').each(function(i) {
            var $li = $(this).parent();

            $(this).click(function() {
                if (!$li.hasClass('active')) {
                    $li.addClass('active').siblings().removeClass('active');
                    $carousel_inner.css('transform', 'translateX(-' + (i * 25) + '%)');
                }
            });
        });
    }

    navigation();
    sub_nav_columns();
    disable_empty_anchors();
    refresh_on_resize_mobile();
    set_footer_year();
    toggle_search();
    store_and_get_booking_email();

    if ($window.width() >= sm) {
        set_section_height();
        section_pagination();
    }

    $window.resize(function() {
        sub_nav_columns();

        if ($window.width() >= sm) {
            set_section_height();
            section_pagination();
        }
    });

    // Homepage 
    if ($('.home').length) {
        online_tools_accordion();
        support_card_carousel();

        $window.resize(function() {
            if ($window.width() >= sm) {
                resize_accordion();
            }
        });
    }

    // About
    if ($('.about').length) {
        expert_carousel();
    }

});