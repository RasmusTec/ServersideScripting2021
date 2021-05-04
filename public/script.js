function clearImage(){
    document.getElementById('imageName').value = '';
    document.getElementById('imageView').src = '';
    let img = document.getElementById('imageView');
    img.style.height = "0px";
    img.style.width = "0px";
}
