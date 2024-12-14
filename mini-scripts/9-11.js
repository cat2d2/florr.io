document.title = "happy plane day!";
const faviconURL = "https://static.thenounproject.com/png/2965907-200.png";
let favicons = document.querySelectorAll("link[rel*='icon']");
favicons.forEach(favicon => favicon.parentNode.removeChild(favicon));
let newFavicon = document.createElement('link');
newFavicon.type = 'image/png';
newFavicon.rel = 'icon';
newFavicon.href = faviconURL;
document.getElementsByTagName('head')[0].appendChild(newFavicon);
