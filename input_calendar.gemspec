# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "input_calendar/version"

Gem::Specification.new do |s|
  s.name        = "input_calendar"
  s.version     = InputCalendar::VERSION
  s.authors     = ["Josh Goebel"]
  s.email       = ["me@joshgoebel.com"]
  s.homepage    = "http://github.com/yyyc514/input_calendar"
  s.summary     = %q{Simple and clean JS calendar to enter dates on forms}
  s.description = %q{Simple and clean JS calendar to enter dates on forms}

  s.rubyforge_project = "input_calendar"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
end
