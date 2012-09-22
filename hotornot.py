import os
import webapp2
import jinja2

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class MainPage(webapp2.RequestHandler):
	def _setup(self):
		self.templateValues = {}
		
	def get(self):
		self._setup()
		self.templateValues['type'] = 'get'
		self._render()

	def post(self):
		self._setup()
		self.templateValues['type'] = 'post'
		self._render()
	
	def _render(self):
		template = jinja_environment.get_template('index.html')
		self.response.out.write(template.render(self.templateValues))

app = webapp2.WSGIApplication([('/', MainPage)], debug=True)
