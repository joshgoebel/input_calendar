# input_calendar

## How to use

In your view:

    <% form_for @event do |f| %>
      <%= f.hidden_field :date %>
      <%= javascript_tag "Calendar.attach('event_date')" %>
    <% end %>
    
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

    bundle exec rake input_calendar:copy_files
    
Should give you:

    create  public/javascripts/input_calendar.js
    create  public/stylesheets/input_calendar.css

    
### Rails 2.x

TODO: Add directions here.