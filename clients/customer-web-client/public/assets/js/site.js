var prevScrollPos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;

  if (currentScrollPos === 0) {
    document.getElementById('navbar').style.top = '0';
    return;
  }

  if (prevScrollPos > currentScrollPos) {
    document.getElementById('navbar').style.top = '0';
  } else {
    document.getElementById('navbar').style.top = '-130px';
  }

  prevScrollPos = currentScrollPos;
};
