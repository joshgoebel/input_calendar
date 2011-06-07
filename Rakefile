require 'bundler/gem_tasks'
require 'rake'
require 'fileutils'

task :compile do
  `coffee -c -o vendor/assets/javascripts src/*.coffee`
  FileUtils.mv("vendor/assets/javascripts/calendar.js",
    "vendor/assets/javascripts/input_calendar.js")
end

task :watch do
  exec "zsh -c 'coffee -c -w -o vendor/assets/javascripts src/*.coffee '"
end