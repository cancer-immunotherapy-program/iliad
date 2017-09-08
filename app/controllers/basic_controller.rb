class BasicController < ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  before_filter :editable_check, only: :update
end
