/**
 * jQuery "pager" plug-in for pagination
 * @author Kirk Holder
 * 
 * Copyright (c) 2012 Kirk Holder
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
 * of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies 
 * or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE 
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function ($) {
    "use strict";
    $.fn.pager = function (options) {
        var defaults = {
                display: 10,
                navMax: 5,
                location: 'before',
                index: 0
            },
            nav = {
                total: 0,
                html: '',
                name: 'pager',
                active: 'active'
            },
            config = $.extend(defaults, options),
            el = $(this).children(), rel = '', loc = '',
            total = 0, max = 0, index = 0, min = 0, n = 0, radix = 10,
            getDigits = function (arg) {
                return arg.replace(/\D/g, '');
            },
            getHash = function () {
                return window.location.hash;
            },
            goTo = function (index) {
                min = Math.min(index * config.display, total);
                min = Math.max(min, 0);
                max = Math.min(min + config.display, total);
                el.css('display', 'none').slice(min, max).css('display', 'block');
                n = Math.max(Math.min(index + 1, nav.total), 0);
                $('.' + nav.name + ' a').removeClass(nav.active);
                $('.' + nav.name + ' a#pager' + n).addClass(nav.active);
                if (nav.total > config.navMax) {
                    $('.' + nav.name + ' li.item').removeClass('disable').each(function (n) {
                        if ((n !== 0 && n !== nav.total - 1) && (
                              (index <= 3 && n > Math.round(config.navMax)) || (
                                index >= 4 && index < nav.total - 1 &&
                                (n < index - Math.floor(config.navMax / 2) ||
                                 n > index + Math.floor(config.navMax / 2))
                              ) || (
                                  index >= nav.total - Math.round(config.navMax / 2) &&
                                  n < index - config.navMax
                                )
                            )
                        ) {
                            $(this).addClass('disable');
                        }
                    });
                }
                window.location.hash = n;
            };
        
        index = (getHash().length === 0) ? config.index : parseInt(getDigits(getHash()), radix) - 1;
        total = el.length;
        nav.total = Math.ceil(total / config.display);
        nav.html = '<ul class="' + nav.name + '">';
        nav.html += '<li><a href="#" rel="Prev">Prev</a></li>';
        for (n = 1; n <= nav.total; n += 1) {
            nav.html += '<li class="item"><a href="#' + n + '" id="pager' + n + '" rel="' + n + '">' + n + '</a></li>';
        }
        nav.html += '<li><a href="#" rel="Next">Next</a></li>';
        nav.html += '</ul>';
        if (typeof config.location === 'string' && nav.total > 1) {
            loc = config.location.toLowerCase();
            if (loc === 'before' || loc === 'both') {
                this.before(nav.html);
            }
            if (loc === 'after' || loc === 'both') {
                this.after(nav.html);
            }
            $('.' + nav.name + ' > li > a').click(function () {
                rel = $(this).attr('rel').toLowerCase();
                if (getDigits(rel).length > 0) {
                    n = parseInt(getDigits(rel), radix) - 1;
                    goTo(n);
                } else if (rel === 'prev') {
                    n = Math.max(parseInt(getDigits(getHash()), radix) - 2, 0);
                    goTo(n);
                }
                else if (rel === 'next') {
                    n = Math.min(parseInt(getDigits(getHash()), radix), nav.total - 1);
                    goTo(n);
                }
                return false;
            });
            // fix webkit redraw issue by forcing browser to redraw
            $('ul.pager').each(function () {
                this.style.webkitTransform = 'scale(1)';
                $(this).append('<div id="pager_redraw"></div>');
                $('#pager_redraw').fadeOut('fast', function () {
                    $(this).unbind().remove();
                });
            });
        }
        window.onhashchange = function () {
            n = parseInt(getDigits(getHash()), radix) - 1;
            goTo(n);
        };
        goTo(index);
        return this;
    };
}(jQuery || {}));