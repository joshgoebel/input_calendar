# input_calendar

At the current time __input_calendar__ is optimized for static calendars that stay in place and are used in place (how I usually prefer a calendar in apps).  No reason it couldn't be enhanced to hide/show dynamically and support visible date fields.

Interesting in patches to make it more configurable as long as it stays simple and elegant.

## How to use

In your view:

    <% form_for @event do |f| %>
      <%= f.hidden_field :date, :class => "calendar" %>
      <%= javascript_tag "Calendar.attach('event_date', {class: 'mycustomcssclass'})" %>
    <% end %>
    
Or avoid the inline JS with some jQuery (coffeescript) somewhere:

    $(document).ready -> 
      $("input.calendar").each (i, o) -> 
        Calendar.attach(o)

## Options you can pass attach

* class - custom CSS class (or multiple classes)
* onchange - function that is called each time a date is selected
* footer - underscore.js style template string for the footer
  * Supports: month (full name), day, year, day_of_week (full name)

Example of using footer:

    Calendar.attach("event_date", {footer: "<strong>Due by:</strong> <%= month %> <%= day %>, <%= year %>"})

## Installing
    
### Requirements

Requires jQuery and underscore.js.

* http://jquery.com/
* http://documentcloud.github.com/underscore/


### Rails 3.1

You'll need to add input_calendar to your Gemfile and then the asset pipeline will see that the appropriate JS and CSS files are included in your app.

Add to your Gemfile:

    gem "input_calendar"

And install:

    bundle install

    
### Rails 3.0 (using Bundler)

A rake task is included to copy the JS and CSS files into your public folder.

Add to your Gemfile:

    gem "input_calendar"
    
Then copy the files locally:

    bundle install
    bundle exec rake input_calendar:copy_files
    
Should give you:

    create  public/javascripts/input_calendar.js
    create  public/stylesheets/input_calendar.css

    
### Rails 2.x

TODO: Add directions here.