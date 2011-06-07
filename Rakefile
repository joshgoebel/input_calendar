require 'bundler/gem_tasks'
require 'rake'
require 'fileutils'

task :default => [:compile]

task :compile do
  puts `coffee -c -o vendor/assets/javascripts src/*.coffee`
  FileUtils.mv("vendor/assets/javascripts/calendar.js",
    "vendor/assets/javascripts/input_calendar.js")
end

task :build => :compile

task :watch do
  exec "zsh -c 'coffee -c -w -o vendor/assets/javascripts src/*.coffee '"
end