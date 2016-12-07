import os.path
import re
import sys

sys.path.insert(0, 'pelican-plugins.git')

from liquid_tags.mdx_liquid_tags import LiquidTags

@LiquidTags.register('youtube')
def youtube(preprocessor, tag, markup):
    parts = markup.split(None, 2)

    result_string = """
<div class="youtube-wrapper">
    <div class="youtube-embed" data-embed="{id}">
        <div class="play-button no-js"></div>
        <noscript><iframe src="https://www.youtube.com/embed/{id}" allowfullscreen></iframe></noscript>
    </div>
</div>""".format(id = parts[0])

    return result_string

# this import makes pelican registration work
from liquid_tags import register
