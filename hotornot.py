import os
import webapp2
import jinja2
from cattle import Cattle
from google.appengine.ext import db


jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class MainPage(webapp2.RequestHandler):
	def _setup(self):
		self.templateValues = {}
		
	def get(self):
		self._setup()
		self.templateValues['type'] = 'get'
		self._handle()

	def post(self):
		self._setup()
		self.templateValues['type'] = 'post'
		self._handle()

	def _handle(self):
		args = self.request.arguments()
		if "ajax" in args:
			self._ajax(self.request);
		else:	
			self._render()
	
	def _render(self):
		template = jinja_environment.get_template('index.html')
		self.response.out.write(template.render(self.templateValues))

	def _ajax(self, request):
		if request.get('ajax', '')  == 'vote':
			upvote = request.get('upvote', '')
			downvote = request.get('downvote', '')
		
			cattle = self._doVoting(upvote, downvote)
			self.response.out.write('{winner:'+ upvote +',upvotes:' + str(cattle.upvotes)+"}" )
		elif request.get('ajax', '') == 'getVotes':
			cattle = self._getOrCreate(request.get('id'))	
			self.response.out.write(str(cattle.upvotes))

	def _doVoting(self, upvote, downvote):
		upCattle = self._getOrCreate(upvote)
		upCattle.upvotes += 1
		upCattle.put();
		return upCattle;
	
	def _getOrCreate(self, cattleId):
		cattle = Cattle.get_or_insert(cattleId, upvotes=0, downvotes=0)
		return cattle
			

app = webapp2.WSGIApplication([('/', MainPage)], debug=True)
