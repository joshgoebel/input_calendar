(function() {
  var $, DateHelper, dh;

  $ = jQuery;

  this.Calendar = (function() {

    function Calendar(id, field, options) {
      var _base, _ref;
      this.id = id;
      this.field = field;
      this.options = options != null ? options : {};
      if (!this.field.jquery) this.field = $("#" + this.field);
      if (this.id != null) {
        this.element = $("#" + this.id);
      } else {
        this.element = $("<div>").insertAfter(this.field);
      }
      this.show();
      if ((_ref = (_base = this.options)["class"]) == null) {
        _base["class"] = "minicalendar";
      }
      if (this.options.footer) {
        this.footerTemplate = _.template(this.options.footer);
      }
      this.date = new Date;
      this.getDateFromField();
      this.pager_date = new Date(this.date);
      this.redraw();
    }

    Calendar.attach = function(field, options) {
      return new Calendar(null, field, options);
    };

    Calendar.prototype.getDateFromField = function() {
      if (this.field.val() === "") return;
      return this.date = this.parseIncomingDate();
    };

    Calendar.prototype.parseIncomingDate = function() {
      var date, day, month, year, _ref;
      date = this.field.val().split(" ")[0];
      _ref = _.map(date.split("-"), function(x) {
        return parseInt(x.replace(/^0/, ""));
      }), year = _ref[0], month = _ref[1], day = _ref[2];
      return new Date(year, month - 1, day);
    };

    Calendar.prototype.show = function() {
      return this.element.show();
    };

    Calendar.prototype.hide = function() {
      return this.element.hide();
    };

    Calendar.prototype.label = function() {
      return this.MONTHS[this.pager_date.getMonth()].label + " " + this.pager_date.getFullYear();
    };

    Calendar.prototype.MONTHS = [
      {
        label: 'January',
        days: 31
      }, {
        label: 'February',
        days: 28
      }, {
        label: 'March',
        days: 31
      }, {
        label: 'April',
        days: 30
      }, {
        label: 'May',
        days: 31
      }, {
        label: 'June',
        days: 30
      }, {
        label: 'July',
        days: 31
      }, {
        label: 'August',
        days: 31
      }, {
        label: 'September',
        days: 30
      }, {
        label: 'October',
        days: 31
      }, {
        label: 'November',
        days: 30
      }, {
        label: 'December',
        days: 31
      }
    ];

    Calendar.prototype.DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    Calendar.prototype.dayRows = function() {
      var day;
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = this.DAYS;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          day = _ref[_i];
          _results.push("<th>" + day.slice(0, 1) + "</th>");
        }
        return _results;
      }).call(this)).join("");
    };

    Calendar.prototype.forward = function() {
      dh(this.pager_date).forward_a_month();
      this.redraw();
      return false;
    };

    Calendar.prototype.back = function() {
      dh(this.pager_date).back_a_month();
      this.redraw();
      return false;
    };

    Calendar.prototype.days_in_month = function(date) {
      var length, month, year, _ref;
      _ref = [date.getMonth(), date.getFullYear()], month = _ref[0], year = _ref[1];
      length = this.MONTHS[month].days;
      return (month == 1 && (year % 4 == 0) && (year % 100 != 0)) ? 29 : length;;
    };

    Calendar.prototype.buildDateCells = function() {
      var date, day, first_day, html, i, month, _i, _len, _ref;
      date = dh(new Date(this.pager_date));
      date.setDate(1);
      month = this.pager_date.getMonth();
      first_day = date.getDay();
      for (i = 1; 1 <= first_day ? i <= first_day : i >= first_day; 1 <= first_day ? i++ : i--) {
        date.go_yesterday();
      }
      html = "";
      i = 0;
      while (i < this.days_in_month(date) + first_day - 1) {
        html += "<tr>";
        _ref = this.DAYS;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          day = _ref[_i];
          html += this.buildDayCell(date, month);
          date.go_tomorrow();
          i += 1;
        }
        html += "</tr>";
      }
      return html;
    };

    Calendar.prototype.buildDayCell = function(date, month) {
      var classes;
      classes = [];
      classes.push("day");
      if (date.getMonth() !== month) classes.push("othermonth");
      if (date.same_as(new Date())) classes.push("today");
      if (date.same_as(this.date)) classes.push("selected");
      return "<td class='" + (classes.join(" ")) + "'><a data-date='" + (date.toLocaleString()) + "' href='#'>" + (date.getDate()) + "</a></td>";
    };

    Calendar.prototype.clicked = function(event) {
      var o;
      o = $(event.target);
      if (o[0].tagName === "TD") o = o.children("A");
      this.date = new Date(Date.parse(o.data("date")));
      this.field.val(this.date.toLocaleDateString());
      this.element.find(".selected").removeClass("selected");
      o.parent().addClass("selected");
      this.element.find(".selectedtext").html(this.generateFooter());
      if (this.options.onchange) this.options.onchange(this.field.val());
      return false;
    };

    Calendar.prototype.generateFooter = function() {
      var params;
      if (this.footerTemplate) {
        params = {
          day: this.date.getDate(),
          month: this.MONTHS[this.date.getMonth()].label,
          day_of_week: this.DAYS[this.date.getDay()],
          year: this.date.getFullYear()
        };
        return this.footerTemplate(params);
      } else {
        return "<b>" + this.DAYS[this.date.getDay()] + "</b><br />" + this.MONTHS[this.date.getMonth()].label + " " + (this.date.getDate()) + ", " + (this.date.getFullYear());
      }
    };

    Calendar.prototype.redraw = function() {
      var html;
      var _this = this;
      html = "<table class=\"" + this.options["class"] + "\" cellspacing=\"0\">\n<thead>  \n   <tr><th class=\"back\"><a href=\"#\">&larr;</a></th>\n       <th colspan=\"5\" class=\"month_label\">" + (this.label()) + "</th>\n       <th class=\"forward\"><a href=\"#\">&rarr;</a></th></tr>\n   <tr class=\"day_header\">" + (this.dayRows()) + "</tr>\n </thead>\n <tbody>" + (this.buildDateCells()) + "</tbody>\n <tfoot>\n   <tr><td colspan=\"7\" class=\"selectedtext\">" + (this.generateFooter()) + "</td></tr>\n </tfoot>\n </table>";
      this.element.html(html);
      this.element.find("th.back").click(function() {
        return _this.back();
      });
      this.element.find("th.forward").click(function() {
        return _this.forward();
      });
      return this.element.find("tbody").click(function(event) {
        return _this.clicked(event);
      });
    };

    return Calendar;

  })();

  dh = function(date) {
    _.extend(date, DateHelper);
    return date;
  };

  DateHelper = (function() {

    function DateHelper() {}

    DateHelper.forward_a_month = function(count) {
      var d, month;
      if (count == null) count = 1;
      month = this.getMonth() + count;
      d = new Date(this.getFullYear(), month, 1);
      return this.setTime(d);
    };

    DateHelper.back_a_month = function(count) {
      var d, month;
      if (count == null) count = 1;
      month = this.getMonth() - count;
      d = new Date(this.getFullYear(), month, 1);
      return this.setTime(d);
    };

    DateHelper.same_as = function(date) {
      return this.getFullYear() === date.getFullYear() && this.getMonth() === date.getMonth() && this.getDate() === date.getDate();
    };

    DateHelper.go_tomorrow = function() {
      return this.setTime(new Date(this.valueOf() + 1000 * 60 * 60 * 24));
    };

    DateHelper.go_yesterday = function() {
      return this.setTime(new Date(this.valueOf() - 1000 * 60 * 60 * 24));
    };

    return DateHelper;

  })();

}).call(this);
