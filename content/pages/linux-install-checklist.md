Title: Linux Checklist
Date: 2016-10-04 18:23
Author: VanillaHoys
Slug:  linux-checklist

Like many Linux users I have a favorite distribution, DE, WM, Terminal
Emulator, Theme etc. In order to remember (and eternally reconsider) my
usual configuration I like to note and document all the packages I
install and tweaks I make. Hope you'll find it interesting too!

------------------------------------------------------------------------

Distribution : Antergos
-----------------------

I'm a fan of Arch's always up-to-date/bleeding edge/rolling release
philosophy. I don't mind having to do potential maintenance in the rare
case where it break (which happens rarely anyway!). However I'm not a
big fan of the install process. I would prefer to start from a good base
and work my way up from there than start for scratch

For that reason my distro of choice is
**[Antergos](https://antergos.com/)**. The default installation is
stable, the customization available in the installer are useful to speed
up the install process and the Antergos repo has plenty of cool things
in it!

An alternative choice would be Manjaro but I haven't had the time to
test it intensively yet. Moving on!

<span style="opacity: 0.8;">If you're interested in reading more reasons
as to why Antergos is awesome I recommend : [Why you should try Antergos
my fellow
developer](https://medium.com/@adambrodziak/why-you-should-try-antergos-my-fellow-developer-b9fb7765b035#.9exjbuh8s)</span>

### Installation Settings

During the installation the settings I chose are : **Base**, **Enable
Arch User Repository (AUR) Support** and **Disable Printing Support**

Due to selecting the Base (no DE) setting our installation options are
limited compared to users selecting XFCE, Gnome or any other DE. But
since I don't plan on really using any DE this ensure we have a
lightweight install! (About 325\~ packages installed at first start)

> **Note :** Most of the packages in this guide come from the AUR. You
> should understand how Arch packages work and always inspect the
> PKGBUILDs before blindly installing anything on the internet!

AUR Helper
----------

> **Alternative :** If you don't mind using yaourt skip this. Yaourt is
> installed by default with our installation settings

Due to enabling 'Arch User Repositery (AUR) Support' during the
installation the AUR Helper *yaourt* is installed. There's nothing wrong
with yaourt! A lot of people use it daily. However I prefer the workflow
of *pacaur*

To install it we have two choices : We can do it through yaourt or
install it ourselves with pacman and makepkg.

> **Note :** It's possible that cower print an error when installing.
> [To fix it follow the step in the pinned comment
> here](https://aur.archlinux.org/packages/cower/) or use
> --skippgpcheck</strong>

**Yaourt :**
`yaourt -S pacaur`

**Pacman/makepkg :**
Prerequisites :
`sudo pacman -S expac`

Cower :
`cd ~ && mkdir Builds && cd Builds curl https://aur.archlinux.org/cgit/aur.git/snapshot/cower.tar.gz | tar xvz cd cower makepkg -sci`

and then finally pacaur :
`cd ~/Builds curl https://aur.archlinux.org/cgit/aur.git/snapshot/pacaur.tar.gz | tar xvz cd pacaur makepkg -sci`

*pacaur* is now ready to be used!

> **Note :** All the future code blocks in this post will use *pacaur*
> however the same commands should work just fine with yaourt

Base Softwares (Desktop Usability)
----------------------------------

Xorg-server should already be installed so we'll install xorg-xinit,
xterm, and i3 (gaps) to get a desktop albeit not very pretty but
working!

`pacaur -S xorg-xinit xterm i3-gaps-git`

In case you're wondering why we're installing xterm, it's because
otherwise we won't have any usable terminal emulator in i3 until we
install our favorite one. We could also install vim during this step
since we plan on editing a few config files soon but nano is enough for
me

We then need to create our own xinitrc and xserverrc so startx/xinit
start our softwares correctly. Let's start by copying the default config
files

`cp /etc/X11/xinit/.xinitrc ~/.xinitrc cp /etc/X11/xinit/.xserverrc ~/.xserverrc`

For .xinitrc : We need to add

    exec i3

at the end and remove/comment the default lines that start twm, xclock
and xterm.

For .xserverrc : We need to add

    vt$XDG_VTNR

at the end of the second line (the one that start X)

Once this is done we can start our very pretty 'desktop environment' by
simply typing xinit!

### i3 basic config (status bar)

You should now see a black screen with a tiny 1 in a blue box in the
bottom left corner, a red error message in the bottom right and a window
which should be the i3 configuration wizard!

In my case I pretty much want the default configuration so I simply
press Enter two times (Generate a config and set the modifier key to be
Windows)

We'll now fix the error message in the bottom right by installing
i3blocks-gaps-git and making a simple tweak to the config file

`pacaur -S i3blocks-gaps-git`

In the i3 config file (\~/.config/i3/config) replace i3status by
i3blocks at line 155. Press \$mod+shift+r to restart i3 and the error in
the bottom right corner should have been replaced with a status bar.

We'll do further tweaks to the i3 config later on but we can leave it
alone for the moment

### Font Rendering and additional fonts

You might have noticed that fonts are hard to read and generally blurry.
That's normal! This is the power of Linux.

Fixing Font Rendering on Arch is not always an easy operation and
there's multiple ways to approach it. Some install Infinality others
Ubuntu's fontconfig and some install neither and install a few fonts
individually and make tweaks to config files.

I used to do the third option but it was actually a fair amount of work
to get it working correctly sometimes so I gave up and started using
Infinality

#### Infinality

To install Infinality simply follow the steps [in this
post](https://bbs.archlinux.org/viewtopic.php?id=162098) (we want fonts
from the infinality-bundle-fonts repo too)

In order to hopefully never have to install fonts again (apart for
pretty terminal and editors fonts of course) we'll install both the
*ibfonts-meta-base* and *ibfonts-meta-extended* meta packages.

`pacaur -S ibfonts-meta-base ibfonts-meta-extended`

> **Alternative :** A less.. kneejerk reaction for this is to install
> the *ibfonts-meta-extended-lt* meta package instead of the non-lt and
> then install individual fonts for language support

With these two, we can view documents in non-latin languages and
documents designed around Microsoft's fonts (without actually installing
them) without any trouble!

> **Note :** With this config Symbola will be used to render Emojis.
> twemoji-color-font (Twitter), emojione-color-font (EmojiOne) or
> noto-fonts-emoji (Google) can be installed to get a more common emoji
> font. Please note that in non-Gecko based browers they won't be in
> color. [This website](http://getemoji.com/) can be used to test your
> emoji configuration! 😉

#### Other fonts

We won't use them yet since we don't have our editor or terminal
emulator installed but let's install a few cool looking fonts for future
usage

`pacaur -S ttf-iosevka-ibx ttf-font-awesome`

### i3 config part 2, Nitrogen and rofi

#### Needed Packages

Before starting this part let's install a few softwares we'll need :

`pacaur -S nitrogen rofi xdg-user-dirs`

#### xdg-user-dirs

We'll be dealing with saving pictures (wallpapers) so we'll execute
*xdg-user-dirs-update* in order to generate the basic home folder
structure

#### i3 config

> **Note :** This part include a lot of config file edition. If you're
> not confortable with terminal-based editors you should install your
> favorite editor right now

Since we now have the power of correct font rendering we can start
tweaking for visual confort. First we'll edit i3 config file to add gaps
and better borders so open .config/i3/config with your favorite editor
and let's start!

#### Borders and Gaps (i3)

Anywhere you prefer in the file add these lines (I personally like
putting it just before the bar settings) :

`# Borders for_window [class="^.*] border pixel 3 smart_borders no_gaps`

\# Gaps
gaps inner 10
gaps outer 5
smart\_gaps on
</code>

Press \$mod+shift+r to reload i3 and you should now have working gaps.
Please note that the option smart\_gaps is enabled and thus you won't
get gaps if there's only one tiled window on the screen.

#### Status Bar (i3)

Next up let's make a few tweaks to the status bar. Add these lines where
we previously replaced i3status by i3blocks (if you pasted the previous
config before the bar settings this should be the line 164\~)

`position top font pango:iosevka, FontAwesome 10`

#### Nitrogen

Next, start nitrogen (type nitrogen in a terminal) and set a wallpaper.
Nitrogen by itself can't set the wallpaper at every launch so we need to
add a line to the i3 config file (again wherever you prefer. I like
putting auto-execs at the end of the file)

`exec_always --no-startup-id nitrogen --restore`

> **Note :** By default it's possible that no wallpapers show up in
> Nitrogen. The reason is that no directories are configured. Go in the
> Preferences menu and add the folder where your wallpapers are located

#### Rofi

If you've used i3 before you might have noticed that \$mod+d doesn't
work. That's because we didn't install dmenu. However we installed rofi
which will "replace dmenu" in our installation.

At line 39 (assuming you closely follow this checklist) replace
dmenu\_run by

`"rofi -show run -sidebar-mode -fullscreen -padding 300"`

Reload the config (using \$mod+shift+r) and \$mod+d should now start
rofi in fullscreen mode! The colors are not very pretty and being full
opaque is not really practical but we'll tweak the visuals later, okay?

### GTK & Terminal Emulator

Since we will now start seriously using actual GUI we need a GTK theme.
Antergos has a fork of Numix which is pretty so we'll simply use that

`pacaur -S numix-frost-themes numix-circle-icon-theme lxappearance`

We also needed a software to manage GTK themes and settings so we
installed lxappearance aswell. And we'll use it right now to select our
theme and icons!

If you haven't installed another one already, you've been using xterm
since the beginning of this guide. Hell, maybe you even started liking
it!
