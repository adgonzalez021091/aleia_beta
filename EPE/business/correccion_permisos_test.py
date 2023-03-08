#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Mar 17 10:17:34 2022

@author: alvarogonzalez
"""

from pymongo import MongoClient
import datetime

import urllib.parse
username = urllib.parse.quote_plus('aleja_user')
password = urllib.parse.quote_plus('02-10-91aldigovE')
sssmongo_client = MongoClient('mongodb://%s:%s@3.137.57.40' % (username, password))
db = mongo_client.aleja_bd


def encontrar_num(temp_string):
    nums = []
    nuevo = True
    indx = 0
    for o in temp_string:
        #print(o,indx)
        if o.isdigit():
            if len(nums) == 0 or nuevo:
                nums.append(str(o))
                nuevo = False
                
            else:
                #print(nums,indx)
                nums[indx] = nums[indx] + str(o)
        elif (o.isalpha() or o == "-" or o == "a") and nuevo == False:
            nuevo = True
            indx = indx+1
            
    return int(nums[0])


c = db.personas.find()
for o in c:

    if 'list' in str(type(o["aspiracion_max"])):
        print(o["id"],o["fecha"],o["nombre"],o["aspiracion_max"])
        value = encontrar_num(o["aspiracion_max"][0].split("a")[1])
        print(value)
        
        db.personas.update_one({"id":o["id"]},{"$set":{"aspiracion_max_rango":o["aspiracion_max"],"aspiracion_max":value}})



"""
c = db.personas.find()
options_sueldo = [
    {"name":"$ 1.000.000 a $ 2.000.000","valm":1,"valt":2},
    {"name":"$ 2.000.000 a $ 3.000.000","valm":2,"valt":3},
    {"name":"$ 3.000.000 a $ 4.000.000","valm":3,"valt":4},
    {"name":"$ 4.000.000 a $ 5.000.000","valm":4,"valt":5},
    {"name":"$ 5.000.000 a $ 6.000.000","valm":5,"valt":6},
    {"name":"$ 6.000.000 a $ 8.000.000","valm":6,"valt":8},
    {"name":"$ 8.000.000 a $ 10.000.000","valm":8,"valt":10},
    {"name":"$ 10.000.000 a $ 12.000.000","valm":10,"valt":12},
    {"name":"$ 12.000.000 a $ 15.000.000","valm":12,"valt":15},
    {"name":"$ 15.000.000 a $ 20.000.000","valm":15,"valt":20},
    {"name":"$ 20.000.000 a $ 25.000.000","valm":20,"valt":25},
    {"name":"$ 25.000.000 a $ 30.000.000","valm":25,"valt":30},
    {"name":"$ 30.000.000 a $ 35.000.000","valm":30,"valt":35},
    {"name":"$ 35.000.000 a $ 45.000.000","valm":35,"valt":45},
    {"name":"$ 45.000.000 a $ 60.000.000","valm":45,"valt":60},
    {"name":"Más de $60.000.000","valm":60,"valt":1000}
]
for u in c:
    temp_string = str(u["aspiracion_max"])
    sal= -1
    nums = []
    indx = 0
    nuevo = True
    if temp_string == "0":
        sal = -1
    elif "integral" in str(temp_string).lower():
        sal = 10000000
    else:
        for o in temp_string:
            #print(o,indx)
            if o.isdigit():
                if len(nums) == 0 or nuevo:
                    nums.append(str(o))
                    nuevo = False
                    
                else:
                    #print(nums,indx)
                    nums[indx] = nums[indx] + str(o)
            elif (o.isalpha() or o == "-" or o == "a") and nuevo == False:
                nuevo = True
                indx = indx+1
                
        #numbers = [int(temp)for temp in temp_string if temp.isalpha()]
        if len(nums) > 0:
            if len(nums[0]) > 2:
                if len(nums[0]) > 8:
                    sal = int(nums[0][0:8])
                else:
                    sal = int(nums[0])
            else:
                sal =int(nums[0])*1000000
                
    if sal != -1:
        for n in options_sueldo:
            if sal/1000000 >= n["valm"] and sal/1000000 < n["valt"]:
                
                print(u["aspiracion_max"],".........",sal/1000000,".....",n)
                break
"""