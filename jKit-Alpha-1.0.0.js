/*!
 * jKit-Alpha.js v1.0.0 
 * Copyright Hopper Sun
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
    throw new Error('jKit\'s JavaScript requires jQuery')
}

+function ($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
        throw new Error('jKit\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
    }
}(jQuery);

if (typeof window.moment === 'undefined') {
    throw new Error('jKit\'s JavaScript requires moment')
}

/* ========================================================================
 * jKit: jKit-Alpha.js v1.0.0
 * Project: https://github.com/HopperGithub/jKit
 * ========================================================================
 * Copyright Hopper Sun
 * Licensed under MIT (https://github.com/HopperGithub/jKit/blob/master/LICENSE)
 * ======================================================================== */

/* global define */
(function (undefined) {
    /************************************
     Constants
     ************************************/
    var jKit,
    // the global-scope this is NOT the global object in Node.js
        globalScope = (typeof global !== 'undefined' && (typeof window === 'undefined' || window === global.window)) ? global : this,
        moment = window.moment,
        VERSION = '1.0.0',


        jKit = {
            version: VERSION,
            setCookie: setCookie,
            getCookie: getCookie,
            deleteCookie: deleteCookie,
            isEmptyObject:isEmptyObject,
            hasEmptyPropertyInObject:hasEmptyPropertyInObject,
            compareTwoJson: compareTwoJson,
            getIndexJsonInArray: getIndexJsonInArray,
            parseServ: parseServ,
            stopPropagation: stopPropagation,
            numberFormat: numberFormat,
            getDatesByWeek: getDatesByWeek,
            getDatesByMonth: getDatesByMonth,
            getBeforeWeek:getBeforeWeek,
            getMinutes: getMinutes,
            getDays: getDays,
            getUTC: getUTC,
        };

    globalScope.jKit = jKit;
    /************************************
     Functions
     ************************************/

    /**
     * set cookie and it's alive time
     * @param name
     * @param value
     * @param time unit is second
     * @param secure true will encrypt the cookie when interact with the server
     */
    function setCookie(name, value, time, secure) {
        if (!isNaN(time)) {
            var exp = new Date();
            exp.setTime(exp.getTime() + time * 1000);
            if (secure === true) {
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";secure";
            } else {
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            }
        } else {
            if (time === 'undefined') {
                if (secure === true) {
                    document.cookie = name + "=" + escape(value) + ";secure";
                } else {
                    document.cookie = name + "=" + escape(value);
                }
            }
        }
    }

    /**
     * get cookie by name
     * @param name
     */
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    /**
     * delete cookie by name
     * @param name
     */
    function deleteCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }

    /**
     * get minutes between two time format of which is HH：mm
     * @param startTime
     * @param endTime
     */
    function getMinutes(startTime, endTime) {
        startTime = moment(startTime);
        endTime = moment(endTime);

        startTime.set({'year': 1990, 'month': 1, 'date': 1});
        endTime.set({'year': 1990, 'month': 1, 'date': 1});

        return Math.floor((endTime.unix() - startTime.unix()) / (60));
    }

    /**
     * get days between two date
     * @param startDate
     * @param endDate
     */
    function getDays(startDate, endDate) {
        return Math.floor((endDate.unix() - startDate.unix()) / (24 * 3600));
    }

    /**
     * get UTC format date
     * @param date
     * @param type date format string{ 'd','m'}
     */
    function getUTC(date, type) {
        var format = {
            'd': 'YYYY-MM-DD',
            'm': 'YYYY-MM-DD hh:mm'
        };
        return moment.utc(date, format[type]).valueOf();
    }

    /**
     * 将两个日期之间按照周分类
     * @param startDate
     * @param endDate
     */
    function getDatesByWeek(startDate, endDate) {
        var start = moment(startDate),
            end = moment(endDate),
            begin = moment(start).startOf('week').weekday(0),
            num1,
            num2 = end.unix(),
            firstOfWeek,
            lastOfWeek,
            result = [],
            flag = true;

        if (end.year() == start.year() && end.months() == start.months() && end.weeks() == start.weeks()) {
            result.push(start.format('YYYY/MM/DD') + '-' + end.format('YYYY/MM/DD'));
        }
        else {
            do {
                if (flag) {
                    firstOfWeek = start.format('YYYY/MM/DD');
                    flag = false;
                } else {
                    firstOfWeek = begin.format('YYYY/MM/DD');
                }

                lastOfWeek = begin.add(6, 'd').format('YYYY/MM/DD');

                begin.add(1, 'd');
                num1 = begin.unix();

                if (num1 > num2) {
                    lastOfWeek = end.format('YYYY/MM/DD');
                }

                result.push(firstOfWeek + '-' + lastOfWeek);


            } while (num1 <= num2)
        }
        return result;
    }

    /**
     * 将两个日期之间按照月分类
     * @param startDate
     * @param endDate
     */
    function getDatesByMonth(startDate, endDate) {
        var start = moment(startDate),
            end = moment(endDate),
            begin = moment(start).startOf('month'),
            firstOfMonth,
            lastOfMonth,
            num1,
            num2 = end.unix(),
            result = [],
            flag = true;

        if (end.year() == start.year() && end.months() == start.months()) {
            result.push(start.format('YYYY/MM/DD') + '-' + end.format('YYYY/MM/DD'));
        }
        else {
            do {
                if (flag) {
                    firstOfMonth = start.format('YYYY/MM/DD');
                    flag = false;
                } else {
                    firstOfMonth = begin.startOf('month').format('YYYY/MM/DD');
                }

                lastOfMonth = begin.endOf('month').format('YYYY/MM/DD');

                result.push(firstOfMonth + '-' + lastOfMonth);

                begin.add(1, 'M');
                num1 = begin.unix();
                if (num1 >= num2) {
                    result.push(begin.startOf('month').format('YYYY/MM/DD') + '-' + end.format('YYYY/MM/DD'));
                }
            } while (num1 < num2)
        }
        return result;
    }

    /**
     * 当内部滚动条滚动到顶部或底部时滚动外围滚动条
     * @param e
     */
    function stopPropagation(e) {
        var evt = e.originalEvent,
            target = angular.element(e.target),
            delta = evt.detail ? -evt.detail / 3 : evt.wheelDelta / 120,
            type = e.type,
            container = target.parents('.dataTables_wrapper').find('.dataTables_scrollBody')[0],
            top,
            scrollHeight;

        if (container && (type == 'wheel' || type == 'DOMMouseScroll' || type == 'mousewheel')) {
            top = container.scrollTop,
                scrollHeight = container.clientHeight + top;
            if (e.target.tagName !== 'TH' && !((top <= 0 && delta > 0) || (scrollHeight >= container.scrollHeight && delta < 0))) {
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
            }
        } else {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            }
        }

    }

    function compareTwoJson(obj1, obj2) {
        /// <summary>
        /// 比较两个json对象是否相等
        /// </summary>
        /// <param name="obj1"></param>
        /// <param name="obj2"></param>
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    function getIndexJsonInArray(obj, array) {
        /// <summary>
        /// 获取对象在对象数组中的索引
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="array"></param>
        var result = -1;
        for (var i = 0; i < array.length; i++) {
            if (compareTwoJson(obj, array[i])) {
                result = i;
                return result;
            }
        }
        return result;
    }

    /**
     * 解析server/service
     * return object. for example: {name:string,handler:string}
     */
    function parseServ(serv) {
        if (typeof serv === 'string') {
            var s = serv.split('.');
            serv = {
                name: s[0],
                handler: s[1]
            };
        }
        return serv;
    }

    //format the number
    function numberFormat(number, decimals, decPoint, thousandsSep) {
        //   example 1: number_format(1234.56);
        //   returns 1: '1,235'
        //   example 2: number_format(1234.56, 2, ',', ' ');
        //   returns 2: '1 234,56'
        //   example 3: number_format(1234.5678, 2, '.', '');
        //   returns 3: '1234.57'
        //   example 4: number_format(67, 2, ',', '.');
        //   returns 4: '67,00'
        //   example 5: number_format(1000);
        //   returns 5: '1,000'
        //   example 6: number_format(67.311, 2);
        //   returns 6: '67.31'
        //   example 7: number_format(1000.55, 1);
        //   returns 7: '1,000.6'
        //   example 8: number_format(67000, 5, ',', '.');
        //   returns 8: '67.000,00000'
        //   example 9: number_format(0.9, 0);
        //   returns 9: '1'
        //  example 10: number_format('1.20', 2);
        //  returns 10: '1.20'
        //  example 11: number_format('1.20', 4);
        //  returns 11: '1.2000'
        //  example 12: number_format('1.2000', 3);
        //  returns 12: '1.200'
        //  example 13: number_format('1 000,50', 2, '.', ' ');
        //  returns 13: '100 050.00'
        //  example 14: number_format(1e-8, 8, '.', '');
        //  returns 14: '0.00000001'
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 3 : Math.abs(decimals),
            sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep,
            dec = (typeof decPoint === 'undefined') ? '.' : decPoint,
            s,
            toFixedFix = function (x, y) {
                var k = Math.pow(10, prec);
                return '' + (Math.round(x * k) / k).toFixed(y);
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    /**
     * 获取参数date日期的前一周
     * param: date 传入日期，,当未传入date参数时，以当前日期计算
     * param: firstDay 传入周第1天为星期几，0-7
     * param: beginFormat 传入起始日期格式?
     * param: endFormat 传入结束日期格式
     * return string. for example: {startDate - endDate}
     */
    function getBeforeWeek(date, firstDay, beginFormat, endFormat) {
        date = date ? date : new Date();
        firstDay = (/^[0-7]+$/.test(firstDay) && (firstDay >= 0)) ? firstDay : 1;
        beginFormat = beginFormat || 'YYYY/MM/DD';
        endFormat = endFormat || 'MM/DD';

        var d = moment(date).subtract('d', 7),
            begin = moment(d).startOf('week').isoWeekday(firstDay),
            end = angular.copy(begin).add('d', 6);

        return begin.format(beginFormat) + '-' + end.format(endFormat);
    }

    /**
     * 判断json是否为空
     * @param {type} obj
     * @returns {type}
     */
    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }

    //验证对象里的每个属性是否为空
    function hasEmptyPropertyInObject(obj) {
        for (var property in obj) {
            if (obj[property] == undefined || obj[property] == null) {
                return true;
            }
            if (obj[property].constructor == String && obj[property].length == 0) {
                return true;
            }
        }
        return false;
    }

}).call(this);