
function heroSlider() {
    console.log("hero slider called");
let heroSlider = document.querySelector(".hero-slider");
let images = ['basketball', 'birthday', 'chess', 'cricket', 'gardening', 'marriage', 'programming', 'star-gazing', 'trekking'];

function slider() {
    for(let i = 0; i < images.length; i++) {        
        setInterval(function() {
        heroSlider.innerHTML="";    
        let image = document.createElement("img");
        image.setAttribute('src', '/images/'+ images[i] + '.jpg');
        image.setAttribute('alt',images[i])
        image.classList.add('hero-image');
        heroSlider.append(image);    
        }, 5000);
    }  
}
slider();
}

heroSlider();




