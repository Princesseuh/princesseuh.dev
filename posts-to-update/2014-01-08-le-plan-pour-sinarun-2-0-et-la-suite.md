Title: Le plan pour SinaRun 2.0 et la suite
Date: 2014-01-08 03:05
Author: Princesseuh
Category: Games
Tags: french, SinaRun Classic
Slug: le-plan-pour-sinarun-2-0-et-la-suite
Status: published

BONJOUR ET BIENVENUE SUR MON SITE INTERNET!

Si vous suivez mon Twitter (sinon vous devriez! C'est là que je suis le
plus actif!) vous avez très probablement entendu parlé de "SinaRun 2"

À première vue on pourrait je présume très bien penser que c'est la
suite de SinaRun.. et ça serait pas tellement faux non plus! SinaRun
original est bourré de problème divers et variés et au final c'est
tellement un fouilli que j'ai pas le courage de sauter dedans et tout
réparer.. C'est pour cela que je dis "SinaRun 2"

"Mais Princesseuh! Tout cela n'a aucun sens! On dirait que tu écris pour
toi-même!"

Bon. C'est vrai c'est pas très clair! On recommence désolé.

<!-- more -->

BONJOUR ET BIENVENUE DANS CE NOUVEL ARTICLE!

Ça fait très longtemps qu'il n'y a pas eu de mise à jour pour SinaRun
(ou pour quoique ce soit enfaite. Love&Luck est encore -très- loin de sa
release) La raison? Tout simplement parce-que je travaillais uniquement
sur Love&Luck! Love&Luck avance avance maiiis.. SinaRun reste au point
où il est : Pas joué et très certainement injouable correctement. C'est
dommage mais justement aujourd'hui je suis là pour réparer ça.~~.
Ensemble Super-Héro nous sauv..~~

Comme je l'ai dis plusieurs fois : J'ai appris à utiliser Unity avec
SinaRun. Le code de SinaRun n'est donc pas une merveille technologique!
Il y a énormément de bug (Surtout en multijoueurs) et d'imperfection
(surtout dans les menus) et au final je comprends qu'on puisse ne pas
vraiment vouloir y jouer! Cependant comme le code de SinaRun était déjà
en grande partie implémenté et que c'était un gros foutoir je n'ai
jamais voulu/pu améliorer tout ça. Mais aujourd'hui je suis là pour
réparer ça.

J'ai commencé il y a quelques jours un recodage COMPLET!!1 de SinaRun.
Pour l'instant nommé "SinaRun 2". Cette mise à jour proposera en gros
tout ce que SinaRun original aurait dû déjà proposé.. Comme vous n'êtes
pas moi vous devez pas vraiment savoir ce que je voulais que SinaRun
soit à la base mais je vais faire une liste rapide! Pour toi.

**La Vitesse.**
SinaRun Original est un jeu TRÈS TRÈS lent (Au niveau des déplacements
du moins). Y'a aucune impression de vitesse ni quoique ce soit et aussi
l'accélération est complètement débile. Pour SinaRun 2 la vitesse a été
quasiment doublé et l'accélération que ce soit dans les airs ou sur la
terre a été vachement augmenté. Les déplacements sont donc plus facile à
maitriser même si le jeu reste très dur pour un joueur lambda. (Oui la
glissade a été "enlevé"). Le sprint est toujours de la partie et
l'accélération est maintenant différente si on démarre sans sprint (Bien
qu'il n'y ai aucun avantage à faire ça.)

Également : La vitesse du joueur est maintenant affiché dans
l'interface. Feature demandé depuis SinaRun Original qui ne pouvait
malheureusement pas être implémenté à l'époque. :)

**Le Timer.**
Au début de SinaRun pas mal de gens demandaient un "1. 2. 3. GO!" au
début de la partie. J'ai toujours répondu en disant que c'était inutile
et que ça casserait le rythme. Mon avis n'a pas changé il n'y a pas de
"1. 2. 3. GO!" au début de la partie! Cependant! Le timer ne démarre
maintenant qu'après le premier input. Ça corrige pas mal de problème.
Example : Dans certaines maps de SinaRun Original on commençait en
tombant. Comme l'accélération dans les airs était moins haute que
l'accélération sur terre on atteignait moins rapidement la vitesse
maximale ce qui rendait les départs inconsistant. Bref. C'est corrigé.

Également : Plutôt que d'afficher bêtement les secondes le Timer est
maintenant "stylisé"!. (Minute:Seconde:MS)

**Les problèmes techniques du multijoueurs**
Ahhh le multijoueur de SinaRun Original. Que de plaisir! (Je suis pas
sûr que quelqu'un sauf moi ai déjà joué en multijoueur sur SinaRun).
Entre les musiques qui coupe, les joueurs qui ne sont pas transporté sur
les bonnes maps, les problèmes de trails quand le joueur tombe, les fins
de niveaux qui n'affichait pas toujours le gagnant, l’impossibilité de
voir le nom des gens avec nous, l'impossibilité d'hoster un serveur
"auto-géré" par les joueurs, le manque de modèle 3D pour les joueurs,
les désynchronisations courantes des joueurs, aucune "grosse" protection
contre le cheat, les caméras qui ne s'activaient pas sur les joueurs
(Vous ne l'avez très probablement jamais vu mais ça arrivait) ou tout
simplement les crashs divers.. Je ne sais pas par où commencé.

On va y aller dans l'ordre : La musique dans SinaRun original était codé
très bizarrement à cause que le système de reset était codé très
bizarrement. Ça dépendait de 2-3 objets et d'une dizaine de variable.
Dans SinaRun 2 le système de reset n'étant pas le même (Il reste le même
au niveau du jeu. C'est le code qui change) la musique marche de façon
"Stand Alone" et il n'y a donc pas de problème de ce coté.

Pour les joueurs qui n'étaient pas transporté sur les bonnes maps.. J'ai
oublié de mettre un buffer sur le changement de map. Pour les trails? Ça
vient plutôt d'Unity. Il faut savoir qu'il est impossible de reset une
Trail. Cependant il existe des façons "détournés" qui ne marchaient pas
très bien et qui causait donc des problèmes. Il n'y a pour l'instant pas
de trail dans SinaRun 2 mais j'ai déjà une idée de comment faire pour
corriger le problème!

La fin des niveaux qui n'affichait pas le gagnant? C'est moi qui savait
pas comment les Appels RPC marchaient. La fin a également été recodé
pour être plus jolie visuellement et moins bugué. :)
L’impossibilité de voir le nom des gens? Il y a maintenant une liste de
joueurs et les noms sont désormais écrit en haut des joueurs!

Dans SinaRun Original tout était géré par l'host. C'est lui qui
s'occupait des changements de maps et tout ça. Désormais les joueurs
peuvent voter pour changer la carte (L'host peut également choisir de
changer la carte quand il le souhaite contrairement à SinaRun original).
Il est également possible de kicker des joueurs! :)

Il n'y a jamais eu de modèle 3D pour les joueurs dans SinaRun parce-que
la personne qui s'occupait des animations ne m'a jamais répondu
également le modèle 3D que j'avais (Merci à Gabriel quand même!) n'était
pas très bien fait et était très dur à animer. Cette fois j'ai trouvé
quelqu'un qui s'occupera de refaire le modèle 3D et les animations!
(Note : Les animations ne seront peut-être pas disponible à la sortie
mais les modèles 3D devraient l'être eux)

Les désyncs, les caméras et le manque d'Anti-Cheat était dû au fait que
le code était complètement dégueu. Normalement tout sera corrigé pour
SinaRun 2!

**Le gameplay du multijoueurs**
Le gameplay de SinaRun est simple : Il suffit d'atteindre la fin le plus
rapidement possible et d'améliorer ses temps. En multijoueur c'était
pareil c'est juste qu'il fallait arriver avant ses amis. Je trouve ça
plutôt correct comme mode de jeu mais en multijoueurs d'autre mode de
jeu pourraient également très bien marché. Je pense d'ailleurs que le
mode de jeu "principal" de multijoueurs de SinaRun 2 sera un truc comme
Trackmania. genre 5-10 minutes pour faire le meilleur temps et celui qui
fait le meilleur temps gagne après les 5-10 minutes.

Le mode multijoueurs de InMomentum et de SinaRun Original n'étaient pas
intéressant justement à cause de ça : Les parties étaient beaucoup trop
courte! Il suffisait que quelqu'un gagne (2-3 parties dans le cas de
InMomentum et une seule dans le cas de SinaRun) pour gagner la partie et
changer de map. Quand je jouais avec des gens la plupart du temps ils
n'avaient même pas le temps de voir la moitié de la map que j'avais déjà
fini. C'était pas marrant.. C'est pour ça qu'on mode de jeu qui dure
5-10 minutes sera plus intéressant (Même si je vais own tout le monde
quand même au moins ils auront le temps d'explorer un peu la map ;3)

Bien entendu le mode de jeu "normal" sera quand même disponible. Mais
pour des serveurs "publics" je pense que ce mode de jeu sera plus
agréable à jouer. :)

**Les graphismes et l'HUD général**
On va pas se cacher ça : L'HUD de SinaRun est horrible. J'ai toujours
voulu l'améliorer mais je suis genre le pire mec du monde pour l'UI
Design. Mais bon j'ai regardé quelques tutoriels sur Internet et j'ai
étudié les HUD des autres jeux et j'ai finalement trouvé comment ça
marchait et comment faire pour que ça rende bien. Pour SinaRun 2 le jeu
que j'ai le plus regardé c'est Battlefield 4. Le jeu est peut-être très
nul mais j'aime beaucoup beaucoup l'HUD. Il est clair, pas très gros et
en plus il est jolie! J'ai donc essayé de recréer un truc similaire et
le résultat actuel rend plutôt bien! Le reste de l'interface n'est pas
inspiré de Battlefield 4 mais il reste quand même très jolie. Du moins
pour le moment! (J'ai drop complètement le Skin de base de Unity aussi)

Ah également le système de traduction a été complètement refait et vous
pourrez vous-même proposez vos traductions dans très bientôt! (Pour le
moment le français et l'anglais sont disponible)

Maintenant les graphismes : SinaRun original n'était pas
particulièrement laid. Au contraire je le trouve plutôt jolie! Mais bon
y'a toujours place à l'amélioration. Les graphismes de SinaRun 2 sont
donc légèrement meilleur et plus soigné. Il y a des particules
par-exemple! Ne vous inquiétez pas : Si vous êtes un joueur pro et que
les effets vous gênent vous pourrez toujours les désactiver sans aucun
problème!

**Le reste**
Je crois ça couvre a peu près tout les changements. Bien entendu il y a
énormément de changement "sous le capot" qui ne changent pas grand chose
pour vous mais qui améliorent quand même l'expérience de jeu.
(Par-exemple le système de bind de touche a été refait et les touches
Shift, MouseClick et tout ça sont maintenant accepté!) Voici quelques
améliorations random qui me passent au travers la tête :

- Des classements en ligne seront disponible au travers de site tiers
comme Kongregate et Gamejolt (Pas confirmé pour Kongregate mais ça
devrait se faire.)
- Des achievements seront disponible également au travers de site tiers
(encore comme Kongregate et Gamejolt)
- Il sera possible de changer la couleur de son personnage ou de son
trails pour être mieux reconnu en multijoueur
- La caméra est beaucoup plus haute que dans SinaRun Original (Ce qui
rend les sideboosting beaucoup plus dur à réaliser)
- L'HUD affiche la vitesse minimum qui a été atteinte après avoir
dépassé 1000 de vitesse ou bien avoir atteint la vitesse maximum (2440
de mémoire).
- Il n'y a plus de mini-freeze lors des resets (... Le jeu ne rechargera
pas le niveau à chaque fois ...)
- Le compteur de kill n'est plus partagé en multijoueur

et c'est tout ce je me souviens rapidement. Mais il y a très
probablement beaucoup d'amélioration diverses! (Ah aussi c'est le
premier jeu où les donateurs (FoxFiesta, Noxens, Dwarf, Kumii et Imanor)
seront remercié dans les credits :) Merci beaucoup à Noxens en
particulier!)

BREF! Ça arrive dans bientôt et ça va être vachement cool!
