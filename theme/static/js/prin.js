document.addEventListener('DOMContentLoaded', function () {
    generateHeader();
    youtubeLazyEmbed();
});

// I think this could be improved (without using JQuery)
function toggleResponsiveMenu() {
    var nav = document.getElementsByTagName("nav");
    nav = nav[0];

    if (nav.className == "") {
        nav.className = "responsive";
    }
    else {
        nav.className = "";
    }
}

function generateHeader() {
    // Add random punctuation to the title
    var headerTitle = document.getElementById("site-title");
    var possibleAdditions = ['!', '.', '', '', '', '!?'];
    headerTitle.innerHTML += possibleAdditions[Math.floor(Math.random()*possibleAdditions.length)];

    // Get random sentence
    // This is kinda dirty. But I really like muh random sentences
    var xhr = new XMLHttpRequest();
    var container = document.getElementById("random-sentence");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200)
                container.innerHTML = xhr.responseText;
            else
                container.innerHTML = "Indie Game Developer!"
        }
    }

    xhr.open('GET', "http://princesseuh.eu/new/phrase", true)
    xhr.send();
}

// Taken from https://webdesign.tutsplus.com/tutorials/how-to-lazy-load-embedded-youtube-videos--cms-26743
function youtubeLazyEmbed() {
    var youtube = document.querySelectorAll( ".youtube-embed" );
    var ylength = youtube.length;

    for (var i = 0; i < ylength; i++) {

        // thumbnail image source.
        var source = "https://img.youtube.com/vi/"+ youtube[i].dataset.embed +"/sddefault.jpg";

        // Load the image asynchronously
        var image = new Image();
        image.src = source;
        image.width = "640";
        image.height = "480";
        image.addEventListener("load", function() {youtube[ i ].appendChild( image );}(i));

        youtube[i].addEventListener( "click", function() {
            var iframe = document.createElement("iframe");

            iframe.setAttribute( "allowfullscreen", "" );
            iframe.setAttribute( "src", "https://www.youtube.com/embed/"+ this.dataset.embed +"?rel=0&showinfo=0&autoplay=1" );

            this.innerHTML = "";
            this.appendChild( iframe );
        });
    }
}
