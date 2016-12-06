#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

# This file is only used if you use `make publish` or
# explicitly specify it as your config file.

import os
import sys
sys.path.append(os.curdir)
from pelicanconf import *

SITEURL = 'http://princesseuh.net/'
RELATIVE_URLS = False

FEED_ATOM = 'blog/feeds/atom.xml'
FEED_ALL_ATOM = 'blog/feeds/all.atom.xml'
CATEGORY_FEED_ATOM = 'blog/feeds/%s.atom.xml'

DELETE_OUTPUT_DIRECTORY = True
OUTPUT_PATH = 'output-publish/'

# Following items are often useful when publishing

DISQUS_SITENAME = "princesseuh"
