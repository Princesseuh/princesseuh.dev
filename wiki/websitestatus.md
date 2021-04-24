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

Unlike the Future section below, those are things I would like to be completed before shipping the website officially

### Features

- Add the {% footnoteref "toc-on-blog", "Perhaps this should depend on the size of the article, adding it only when it's really warranted" %}table of content on blog articles{% endfootnoteref %}

### Style

- The website currently doesn't work on mobile and tablets
- Vertical rythmn is mostly good but a few elements are still missing

### Performance

- Properly resize cover images on the index page and in the catalogue

### Code Gardening

- My `.eleventy.js` file is a mess, I need to look into best practices for the architecture of that file otherwise, It'll be a hard to maintain

## Future

Maybe in the future I'd like for those things to happens. I want this website to be the kind of website you get lost in so I'm always up for adding unecessary features. Making people think "Why did she even do that, that's so unnecessary yet so cool" is a cool feeling

### Technology

- Right now this website uses Eleventy with Nunjucks for the templates and Tailwind for the CSS. In the future, I would love to instead move to using Vue 3 for the templates, however `eleventy-plugin-vue` does not [currently support using Vue files as templates](https://github.com/11ty/eleventy-plugin-vue/issues/26) neither does it support Vue 3 so that's not possible for the moment

### Performance and Bugs

- {% footnoteref "spa-full-download", "I tried a few things regarding this and it worked but I couldn't figure out a way to do it cleanly, the current solution works just fine, it's just not optimal. For now, it's not needed however" %}Our SPA implementation download whole pages{% endfootnoteref %} instead of downloading a .json/.js file with just the content needed. This is especially annoying due to our HTML being fairly large due to Tailwind's classes
- Currently the page transition works nicely when going from normal page to wiki but not the reverse, what happens is {% footnoteref "side-transitions-wiki", "Frankly, this is a really minor issue and probably not worth spending too much time on" %}the side menus don't get affected by the transition and instead just disappear instantly once the loading is done{% endfootnoteref %}

### New pages and features

- A reading log? Much like [the one Mark Llobrera has on his website](https://www.markllobrera.com/reading/), such a cool feature! Maybe I should start by reading more books though..
- A {% footnoteref "glitch-gallery", "I used to have this on my old old website, years ago. I'm very good at getting in places in video games that the devs didn't expect and getting artsy with it is really fun" %}gallery of pictures I take of video games glitches{% endfootnoteref %}
- Adding galleries support in posts (that include the wiki) and on standalone pages, [Mark Llorbrera has a cool exemple on his blog using PhotoSwipe](https://www.markllobrera.com/posts/eleventy-building-image-gallery-photoswipe/)
- A stats page with various statistics, useless, but fun
