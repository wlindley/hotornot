from google.appengine.ext import db


class Cattle(db.Model):
	upvotes = db.IntegerProperty()
	downvotes = db.IntegerProperty()
