# This class provides a liquid tag that translates an address to geo coordinates
# in the form `[lat,lng]`.
class GeocodeAddressTag < Liquid::Tag
  def initialize(tag_name, content, tokens)
    super
    @content = content
  end

  def render(context)
    url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1'\
          "&q=#{CGI.escape(context[@content])}"
    results = JSON.parse(URI.parse(url).open.read)
    if results.any?
      "[#{results.first['lat']},#{results.first['lon']}]"
    else
      Jekyll.logger.warn("Can't find coordinates for #{context[@content]}.")
      ''
    end
  end

  Liquid::Template.register_tag 'geocode_address', self
end
