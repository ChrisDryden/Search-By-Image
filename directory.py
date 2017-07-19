# -*- coding: utf-8 -*-
"""
Created on Sat Jul 15 14:29:48 2017

@author: Chris Dryden
"""

import os
from os import listdir
from os.path import isfile, join
currentDir = os.getcwd()
onlyfiles = [f for f in listdir(currentDir + '\static\img')]
print(onlyfiles)