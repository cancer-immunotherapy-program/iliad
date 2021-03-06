# This file is used by Rack-based servers to start the application.

require 'yaml'
require 'bundler'
Bundler.require(:default)

require_relative 'lib/app'
require_relative 'lib/server'

use Etna::ParseBody
use Etna::SymbolizeParams
use Rack::Static, urls: ['/css', '/js', '/fonts', '/img', '/images'], root: 'public'
use Etna::Auth

run App::Server.new(YAML.load(File.read('config.yml')))
