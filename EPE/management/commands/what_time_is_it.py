from django.core.management.base import BaseCommand
from EPE.business.logic import *
from pymongo import MongoClient
import datetime
import urllib.parse
class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
    	print("entroooo2")
    	username = urllib.parse.quote_plus('aleja_user')
    	password = urllib.parse.quote_plus('02-10-91aldigovE')
    	mongo_client = MongoClient('mongodb://%s:%s@3.136.136.6' % (username, password))
    	db = mongo_client.aleja_bd
    	c = db.personas.find({"$and":[{"tipo":6},{"total_logins":""}]})

    	for o in c:

    		fec = datetime.datetime.strptime(o["fecha"], '%Y-%m-%d').date()
    		dias = (datetime.date.today() - fec).days
    		print(fec,dias)
    		if dias % 14 == 0:
    			print(o["mail"],dias)
    			envio_correo("alerta_usuario_compensar",o["id"],{"nombre":o["nombre"],"usuario":o["usuario"],"pass":o["password"]},o["mail"])