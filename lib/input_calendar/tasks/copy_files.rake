require 'thor/group'

class CopyFiles < Thor::Group
  include Thor::Actions
  
  def self.source_root
    File.join(File.dirname(__FILE__),"../../..")
  end
  
  def copy_files
    assets="vendor/assets"
    copy_file "#{assets}/javascripts/input_calendar.js", "public/javascripts/input_calendar.js"
    copy_file "#{assets}/stylesheets/input_calendar.css", "public/stylesheets/input_calendar.css"
  end

end

namespace :input_calendar do
  
  desc "Copy the input_calendar files into public/javascripts, etc..."
  task :copy_files do
    CopyFiles.start
  end
  
end