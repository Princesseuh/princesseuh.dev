---
  title: "The status of this website"
  eleventyNavigation:
    key: Website status
    parent: Misc
---

{% usingCSSComponent "code" %}

Things that should be done, things I'd maybe like to do in the future..

## TODOs

Feature-wise, the website is pretty much finished however, just like anything, it can always be improved and there's still a few details that are wrong. You never really truly feel at home, do you?

### Features
- Add the {% footnoteref "toc-on-blog", "Perhaps this should depend on the size of the article, adding it only when it's really warranted" %}table of content on blog articles{% endfootnoteref %}

### Style

- The website currently doesn't work on mobile and tablets
- Vertical rythmn is mostly good but a few elements are still missing
- Currently the page transition works nicely when going from normal page to wiki but not the reverse, what happens is {% footnoteref "side-transitions-wiki", "Frankly, this is a really minor issue and probably not worth spending too much time on" %}the side menus don't get affected by the transition and instead just disappear instantly once the loading is done{% endfootnoteref %}

### Performance

- {% footnoteref "nesting-bad", "I don't think nesting is as bad as people say (mainly due to gzip/brotli), however it still produces inefficient CSS at the end of the day so I'd rather avoid it" %}Our CSS abuse of nesting{% endfootnoteref %} due to being written hastily
- {% footnoteref "spa-full-download", "I tried a few things regarding this and it worked but I couldn't figure out a way to do it cleanly, the current solution works just fine, it's just not optimal. Will maybe think about this again in the future but for now, it's not needed" %}Our SPA implementation download whole pages{% endfootnoteref %} instead of downloading a .json/.js file with just the content needed

## Features

Maybe in the future I'd like for those things to happens. I want this website to be the kind of website you get lost in so I'm always up for adding unecessary features. Making people think "Why did she even do that, that's so unnecessary yet so cool" is a cool feeling

### New pages

- A reading log? Much like [the one Mark Llobrera has on his website](https://www.markllobrera.com/reading/), such a cool feature! Maybe I should start by reading more books though..
- A {% footnoteref "glitch-gallery", "I used to have this on my old old website, years ago. I'm very good at getting in places in video games that the devs didn't expect and getting artsy with it is really fun" %}gallery of pictures I take of video games glitches{% endfootnoteref %}

### Misc

- Adding galleries support in posts (that include the wiki) and on standalone pages, [Mark Llorbrera has a cool exemple on his blog using PhotoSwipe](https://www.markllobrera.com/posts/eleventy-building-image-gallery-photoswipe/)
- A settings page! Those are rare and weird to see on websites but they're pretty cool. An [exemple of one would be the one Amos's website](https://fasterthanli.me/settings)
