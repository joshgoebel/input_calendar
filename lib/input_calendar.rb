require "input_calendar/version"

module InputCalendar
  class Engine < Rails::Engine
    # just to get rails to think we're an engine
    
    rake_tasks do
      load "input_calendar/tasks/copy_files.rake"
    end
    
  end
end