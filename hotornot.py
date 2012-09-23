import os
import webapp2
import jinja2
import json
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
			fbid = request.get('fbid', '')
		
			cattle = self._doVoting(fbid, upvote)
			self.response.out.write('{winner:'+ upvote +',upvotes:' + str(len(cattle.upvoters))+"}" )
		elif request.get('ajax', '') == 'getVotes':
			cattle = self._getOrCreate(request.get('id'))	
			self.response.out.write(str(len(cattle.upvoters)))
		elif request.get('ajax', '') == 'getDetailedInfo':
			self.response.out.write(str(self._getVotes(request.get('userId'))))

	def _doVoting(self, fbid, upvote):
		upCattle = self._getOrCreate(upvote)
		upCattle.upvoters.append(fbid)
		upCattle.put();
		return upCattle;
	
	def _getOrCreate(self, cattleId):
		cattle = Cattle.get_or_insert(cattleId)
		return cattle

	def _getVotes(self, userId):
		return json.dumps(self._getOrCreate(userId).upvoters)

app = webapp2.WSGIApplication([('/', MainPage)], debug=True)
