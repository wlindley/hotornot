from google.appengine.ext import db


class Cattle(db.Model):
	upvoters = db.StringListProperty()
