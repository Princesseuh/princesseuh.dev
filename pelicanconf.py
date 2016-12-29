#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

# Enable Khan Academy's tota11y
DEBUG_ACCESSIBILITY = False

AUTHOR = 'Princesseuh'
SITENAME = 'Princesseuh'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'America/Toronto'

DEFAULT_LANG = 'en'
DEFAULT_CATEGORY = 'blog'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Name, URL, Icon, featured and a description. This is used to generate the Games section in both the sidebar and the navigation menu
GAMES_LIST = [
        {"name": "SinaRun", "url": "sinarun", "logo_url": "sinarun-mini-logo.png", "featured": True, "desc" : "SinaRun is a 3D parkour/platforming game. Commercial project, check it out on <a href=\"http://store.steampowered.com/app/324470/\">Steam</a>!"},
        {"name": "Other Games", "url": "other-games", "logo_url": "other-mini-logo.png", "featured": False, "desc" : "Smaller projects, prototypes and gamejams are pretty cool too! Wish I did more of these…"}
    ]

# Name, URL. Used for the sidebar Friends section
SIDEBAR_FRIENDS = (
        ("Koumi", "https://twitter.com/kumiiarts"),
        ("FoxFiesta", "https://www.youtube.com/c/AurelienVideos"),
        ("Keranouille", "https://twitter.com/Keranouille")
    )

# Name, URL, Icon. This is used to populate the links in the right part of the navigation menu
SOCIAL_LINKS = (
        ("Twitter", "https://twitter.com/VanillaHoys", "twitter"),
        ("GitHub", "https://github.com/Princesseuh", "github"),
        ("Mail", "mailto:princssdev@gmail.com", "envelope")
    )

# TODO : Make the navigation menu fully config-based. Right now the left part is partly hardcoded into the template

DEFAULT_PAGINATION = 7
PAGINATION_PATTERNS = (
    (1, '{base_name}/', '{base_name}/index.html'),
    (2, '{base_name}/page/{number}/', '{base_name}/page/{number}/index.html'),
)

THEME = 'theme'
STATIC_PATHS = ['assets/', 'assets', 'phrase']
IGNORE_FILES = ['prin.js', '*.sass-cache', 'sass', '.git'] # We ignore .git folders because Pelican try to process them and panic
EXTRA_PATH_METADATA = {
    'assets/favicon.png': {'path' : 'favicon.png'},
}

# Disable processing of .html files. We won't ever use them to write articles
READERS = {'html': None}

# URL Structure

# Our landing/home page
TEMPLATE_PAGES = {
    '../theme/templates/home.html': 'index.html'
}

# These links are clearly not compatible with the ones we had on Wordpress
# We could -in theory- retain compatibility but the file hierarchy would not exactly be sane
ARTICLE_URL = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'
# Drafts URL are not exactly great but it doesn't really matter since users won't see them
# (no, don't try. Drafts are not accessible on the real website)
DRAFT_URL = 'blog/drafts/{slug}/'
DRAFT_SAVE_AS = 'blog/drafts/{slug}/index.html'
AUTHOR_SAVE_AS = False
AUTHORS_SAVE_AS = False
INDEX_SAVE_AS = 'blog/index.html'
INDEX_URL = 'blog/'
PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'
CATEGORY_URL = 'blog/categories/{slug}/'
CATEGORY_SAVE_AS = 'blog/categories/{slug}/index.html'
CATEGORIES_URL = 'blog/categories/'
CATEGORIES_SAVE_AS = 'blog/categories/index.html'
TAG_URL = 'blog/tags/{slug}/'
TAG_SAVE_AS = 'blog/tags/{slug}/index.html'
TAGS_URL = 'blog/tags/'
TAGS_SAVE_AS = 'blog/tags/index.html'

FILENAME_METADATA = '(?P<date>\d{4}-\d{2}-\d{2})-(?P<slug>.*)'

# Typogrify. This can cause a lot of issue. We'll have to keep an eye out!
TYPOGRIFY = True

MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.codehilite': {'css_class': 'highlight', 'linenums': True},
        'markdown.extensions.extra': {},
        'markdown.extensions.fenced_code': {},
        'markdown.extensions.toc': {'anchorlink': True},
    },
    'output_format': 'html5',
}

# Plugins
PLUGIN_PATHS = ['pelican-plugins', 'plugins']
PLUGINS = [
    'lazy-youtube',
    'summary',
    'page-hierarchy'
]

SUMMARY_END_MARKER = '<!-- more -->'
SUMMARY_MAX_LENGTH = None

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True
