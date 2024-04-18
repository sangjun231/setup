const chickenClick = (e) =>{
    const div = document.createElement("div");

    div.style.zIndex = '-1';
    div.style.backgroundImage = 'url(../img/chicken2.png)';
    div.style.backgroundRepeat = 'no-repeat';
    div.style.backgroundSize = "contain";
    div.style.position = "absolute";
    div.style.width = `80px`;
    div.style.height = `80px`;
    div.style.top = `calc(${e.pageY}px - 60px)`;
    div.style.left = `calc(${e.pageX}px - 60px)`;
    div.style.transition = 'opacity .5s linear';

    document.body.appendChild(div);

    setTimeout(() => {
        div.style.opacity = '0';
    }, 600);

    setTimeout(() => {
        div.remove();
    }, 1000)
}

document.body.addEventListener('click', chickenClick)