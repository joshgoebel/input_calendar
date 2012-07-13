$ = jQuery

class @Calendar
  # only syntax takes both the id and field
  constructor: (@id, @field, @options = {}) ->
    # allow us to be passed in a jquery object already
    unless @field.jquery
      @field=$("##{@field}")
    if @id?
      @element=$("##{@id}")
    else
      @element=$("<div>").insertAfter(@field)
    @show()
    @options["class"] ?= "minicalendar"
    if @options.footer
      @footerTemplate = _.template @options.footer
    # default to today before we try and fetch from the field
    @date = new Date
    @getDateFromField()
    @pager_date = new Date(@date)
    @redraw()
  # new syntax, just attach to a form field and let us do the rest
  @attach: (field, options) ->
    new Calendar(null, field, options)

  getDateFromField: () ->
    return if @field.val() == ""
    @date = @parseIncomingDate()

  # should override this in a subclass if you're date string looks different
  parseIncomingDate: () ->
    # cut off the time part of the date element
    @parseDateYMD(@field.val().split(" ")[0])

  show: () -> @element.show()
  hide: () -> @element.hide()
  label: () ->
    @MONTHS[@pager_date.getMonth()].label + " " +
    @pager_date.getFullYear();
    
  MONTHS: [
  	{ label : 'January', days : 31 }
		{ label : 'February', days : 28 }
		{ label : 'March', days : 31 }
		{ label : 'April', days : 30 }
		{ label : 'May', days : 31 }
		{ label : 'June', days : 30 }
		{ label : 'July', days : 31 }
		{ label : 'August', days : 31 }
		{ label : 'September', days : 30 }
		{ label : 'October', days : 31 }
		{ label : 'November', days : 30 }
		{ label : 'December', days : 31 }]

  DAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    
  dayRows: () ->
    ("<th>#{day[0..0]}</th>" for day in @DAYS).join ""
  
  forward: () ->
    dh(@pager_date).forward_a_month() 
    @redraw()
    false

  back: () ->
    dh(@pager_date).back_a_month() 
    @redraw()
    false
  
  days_in_month : (date) ->
      [ month, year ] = [date.getMonth(), date.getFullYear()]
      length = @MONTHS[month].days
      `(month == 1 && (year % 4 == 0) && (year % 100 != 0)) ? 29 : length;`
  
  buildDateCells: () ->
    date = dh(new Date(@pager_date))
    date.setDate(1)
    month = @pager_date.getMonth()
    first_day = i = date.getDay()
    while (i -= 1) > -1
      date.go_yesterday() 
    html = ""
    i = 0
    while i < @days_in_month(date) + first_day - 1
      html += "<tr>"
      for day in @DAYS
        html += @buildDayCell(date, month)
        date.go_tomorrow()
        i+=1
      html += "</tr>"
    html
  
  buildDayCell: (date, month) ->
      classes = []
      classes.push("day") 
      classes.push("othermonth") if date.getMonth() != month
      classes.push("today") if date.same_as(new Date())
      classes.push("selected") if date.same_as(@date)
      "<td class='#{classes.join(" ")}'><a data-date='#{@toDateString(date)}' href='#'>#{date.getDate()}</a></td>"

  toDateString: (date) ->
    month = date.getMonth() + 1
    day = date.getDate()
    month = if month < 10 then "0#{month}" else month
    day = if day < 10 then "0#{day}" else day
    "#{date.getFullYear()}-#{month}-#{day}"
    
  parseDateYMD: (ymd) ->
    args = ymd.split("-")
    new Date(args[0], parseInt(args[1],10)-1, parseInt(args[2],10))

  clicked: (event) ->
    o=$(event.target)
    o=o.children("A") if o[0].tagName=="TD"
    @date = @parseDateYMD(o.data("date"))
    # stuff the raw value in the value field
    @field.val(o.data("date"))
    @element.find(".selected").removeClass "selected"
    o.parent().addClass("selected")
    @element.find(".selectedtext").html @generateFooter()
    if @options.onchange
      @options.onchange(@field.val())
    false
  
  generateFooter: ->
    if @footerTemplate
      params = 
        day: @date.getDate()
        month: @MONTHS[@date.getMonth()].label
        day_of_week: @DAYS[@date.getDay()]
        year: @date.getFullYear()
      @footerTemplate(params)
    else
      "<b>#{@DAYS[@date.getDay()]}</b><br />#{@MONTHS[@date.getMonth()].label} #{@date.getDate()}, #{@date.getFullYear()}"

  redraw: () ->
    html = """<table class="#{@options["class"]}" cellspacing="0">
               <thead>  
                  <tr><th class="back"><a href="#">&larr;</a></th>
                      <th colspan="5" class="month_label">#{@label()}</th>
                      <th class="forward"><a href="#">&rarr;</a></th></tr>
                  <tr class="day_header">#{@dayRows()}</tr>
                </thead>
                <tbody>#{@buildDateCells()}</tbody>
                <tfoot>
                  <tr><td colspan="7" class="selectedtext">#{@generateFooter()}</td></tr>
                </tfoot>
                </table>"""
    @element.html html
    @element.find("th.back").click => @back()
    @element.find("th.forward").click => @forward()
    @element.find("tbody").click (event) => @clicked(event)
    
dh = (date) ->
  _.extend(date, DateHelper)
  date    

class DateHelper
  @forward_a_month: (count = 1) ->
    month=@getMonth()+count
    d = new Date(@getFullYear(), month, 1)
    @setTime(d)
  @back_a_month: (count = 1) ->
    month=@getMonth()-count
    d = new Date(@getFullYear(), month, 1)
    @setTime(d)
  @same_as: (date) ->
    @getFullYear() == date.getFullYear() &&
    @getMonth() == date.getMonth() &&
    @getDate() == date.getDate()
  @go_tomorrow = ->
    @setTime new Date(@valueOf()+1000*60*60*24)
  @go_yesterday = ->
    @setTime new Date(@valueOf()-1000*60*60*24)