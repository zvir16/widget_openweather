  window.addEventListener('scroll', function(e){
    var header = document.getElementById('header'),
        search = document.getElementById('weather-search'),
        stickHeader = header.offsetTop,
        stickSearch = search.offsetTop;

    if (window.pageYOffset > stickHeader || window.pageYOffset > stickSearch) {
      header.classList.add('sticky');
      search.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
      search.classList.remove('sticky');
    }
  })
