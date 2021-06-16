---
  title: "The great Linux file pickers tragedy"
  tagline: "Spoiler: the moral behind this article is 'well yeah but no'"
  eleventyNavigation:
    key: File pickers dilemma
    parent: Computers
---

{% usingCSSComponent "code" %}

File pickers on Linux are.. not good. Pretty much all of them have a few shortcomings that makes the experience fairly deplorable. Let's look at it together!

## The GNOME file picker

First of all, what is a file picker? A file picker is the window that open whenever you press "Save As" or "Open" on most softwares. Right now, if you're using Gnome or any other DE that doesn't have its own file picker and try to save this page, you'll see something that looks like this:

{% image src="./wiki/computers/filepickertragedy/gnomepicker.png", alt="The GNOME default filepicker", caption="Don't mind the double video folders, it's my fault" %}

This is the default GTK file picker, all applications using GTK (which is a lot) use it. It works nicely but.. It's extremely impractical compared to many of its alternatives

The elephant in the room is obviously that it doesn't have thumbnails, an issue discussed [many](https://jayfax.neocities.org/mediocrity/gnome-has-no-thumbnails-in-the-file-picker.html) [times](https://wiki.installgentoo.com/wiki/File_Picker_meme) since [the original bug](https://gitlab.gnome.org/GNOME/gtk/-/issues/233) posted in.. 2004.. yet still unsolved. This makes it really hard to use for anything related to pictures and videos - a common usage since jpeg were invented around 1992

Outside of that specific thing, it has a lot of issues and bugs that makes it really annoying to use, a quick list:

- You can't create a new folder from the right click menu
- It doesn't seem to remember its settings half the time so you need to press right click then "view hidden files" everytime
- It cannot open URLs, this is especially annoying when wanting to set for instance, your Discord avatar using an URL. You have to download the file manually and stuff while Windows will just accept it (and download the picture to its temp folder)
- The navigation buttons and the "url bar" are separated, this uses up a lot of space where they could be merged like they are on Windows. The file name could be at the bottom, like it is on other file saving dialogs, especially considering there's a lot of empty space there
- Huge performance issues in large folders (which also lead to usability issues due to the cursor often jumping)
- Weird behaviour when searching for files

Anyway, I've already moved on from my griefs regarding the GNOME file picker. After all, I've been using it (suffering from it) for the past 10 years or so at this point.

## The KDE file picker

Luckily, this is Linux so we can change stuff we dislike with stuff we don't dislike as much. In this case: the **KDE file picker**

Frankly, it's much much better than the GNOME one these days, first of all it has thumbnails which already means it's much better. Also, as is often the case with KDE stuff, it doesn't suffer from as much UX issues as GNOME's projects tend to

{% image src="./wiki/computers/filepickertragedy/kdepicker.png", alt="The KDE default filepicker", caption="Thumbnails only appear when you are a bit more zoomed but I swear, they definitely exists" %}

It has thumbnails, the "url" bar works like the one on Windows where it works both as navigation and a typing area and it even has syntax coloring in his text preview! It's definitely much better than the GNOME one so, what's the catch?

Well, first of all, it's KDE. Unless you're already using KDE softwares, you'll have to install a lot of dependencies for it (kdialog doesn't suffice on a non-KDE setup, see below). KDE also has the tendency to absolutely rampage through your `.config` folder, creating many config files for softwares you didn't even know the existence of. It's unfortunately really hard to cleanly get specific parts of KDE due to its design

{% image src="./wiki/computers/filepickertragedy/kdeexperience.png", alt="Trojan horse meme where the horse is the KDE file picker and the soldiers inside are 'thousands of dependencies'", caption="Stop baiting me with the pretty UI KDE! I know what you're up to!" %}

Additionally, some softwares just.. don't support it. Chrome and Firefox both does (Chrome does natively, Firefox does through `xdg-desktop-portal`) but for instance, Electron won't ever use it as far as I know. Which, unfortunately for computing, means that even on a full KDE setup, you will eventually encounter the GTK file dialog

But outside of that, it works, it's really good. Probably among the best choices really. Sure, it suffer from a bit of compatibility issues but so does the other alternatives

### Arch Linux guide

While trying to install the KDE file picker on Arch Linux, you'll most likely encounter the following situation unless you're already using KDE softwares: You'll install `kdialog` expecting it to be enough to open the KDE file dialog, but instead, you'll see this:

{% image src="./wiki/computers/filepickertragedy/kdialog.png", alt="The Qt file picker", caption="What is that?" %}

That's, I believe, the default Qt file picker and not the KDE one. To get the KDE one, the minimum list of packages you need to install are those:

- `plasma-integration`
- `breeze` or `breeze-icons` (optional if you have another theme, it's just the default theme)

With those installed, we get the normal KDE picked pictured earlier. It works nicely outside of a few things, namely thumbnails (the one thing we are here for!) and previews

For those to work, you need to install the `kio-extras` package and a few other packages in order get full support for various formats. On most systems you probably already have a few of the packages needed for the common formats (notably `libpng`) but you can install the following packages for other formats:

- `kimageformats` (bunch of stuff, check the optional dependencies)
- `qt5-imageformats` (for TIFF, MNG, TGA and WBMP)
- `ffmpegthumbs` (for video thumbnails, you might need to toggle it on and off in Dolphin because it's a bit wonky on Arch)
- `kdegraphics-thumbnailers` (for PDF, Blender models, RAW files)

After installing those, make sure their previews are enabled in Dolphin's settings (the config file is in `~/.config/dolphinrc`) and with all of that, you should have working KDE filepickers working!

For full compatibility, you need to start programs with `XDG_CURRENT_DESKTOP` set to `KDE` (which might unfortunately cause side effects in certain cases) and for programs that supports it, `GTK_USE_PORTAL` set to `1` with `xdg-desktop-portal` and `xdg-desktop-portal-kde` installed should be enough

{% note 'Quick note' %}
Make sure `xdg-desktop-portal-kde` is running otherwise it won't work

You might need to restart the `xdg-desktop-portal` service after running `xdg-desktop-portal-kde` using `systemctl restart --user xdg-desktop-portal`
{% endnote %}

Congrats, with all that you literally installed more than 100 packages for a file picker. But it works and it's pretty so who's the winner really? 🥲

## The Deepin file Picker

Deepin and Wayland are not the biggest friends so I was not able to install this on my normal setup, in general integrating the Deepin file picker in your system is a bit troublesome. Much like the KDE one, it doesn't come alone and isn't well supported

{% image src="./wiki/computers/filepickertragedy/deepinpicker.png", alt="Deepin default file picker, it's pretty", caption="It's pretty, it has thumbnails and it comes with a dark theme too!" %}

It's possible to integrate it in Chromium using the following value for `XDG_CURRENT_DESKTOP`: `KDE:deepin`. The reason it works is because Chromium checks if any of the values (separated by colons) is equal to KDE and if so, it uses kdialog. Just putting KDE won't work however because kdialog needs `XDG_CURRENT_DESKTOP` to be set to Deepin to set the right dialog

I haven't been able to integrate it with Firefox and other apps depending on `xdg-desktop-portal`, when it works (which isn't all the time) it launches.. a weird old KDE version of the picker with a broken theme. I'm sure there's a way to make it work because the official Deepin distro does make it work but perhaps they're using a custom Firefox or something else? Weird

Deepin unfortunately tends to be.. not so stable and it crashes often. While trying it out, I had to reboot a few times because my system got irresponsive. It's a shame because, outside of that Deepin stuff tend to work well. Special mention to the file manager which I really find enjoyable (though I never got that working on Wayland either)
