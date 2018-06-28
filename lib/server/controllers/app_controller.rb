class App
  class Controller < Etna::Controller
    VIEW_PATH=File.expand_path('../views', __dir__)

    private

    def redirect_to(path)
      @response.redirect(path,302)
      @response.finish
    end

    def success_json(hash)
      success(hash.to_json, 'application/json')
    end

    def config_json
      {
        project_name: @params[:project_name],
        token_name: App.instance.config(:token_name),
        magma_host: App.instance.config(:magma)[:host]
      }.to_json
    end

    def token
      @token ||= @request.cookies[App.instance.config(:token_name)]
    end

    def janus_login_path(refer)
      uri = URI(
        Rails.application.secrets.janus_addr.chomp('/') + '/login'
      )
      uri.query = URI.encode_www_form(refer: refer)
      return uri.to_s
    end

    def current_user
      @current_user ||= User.find_or_create(email: @user.email) do |user|
        user.name = "#{@user.first} #{@user.last}"
      end.tap do |cuser|
        cuser.etna_user = @user
      end
    end
  end
end
